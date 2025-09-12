import { databases, DATABASE_ID, COLLECTIONS } from "./appwrite";
import { ID, Query } from "appwrite";
import type { Note } from "@/types";
import { db } from "./db";
import { generateId, extractTags } from "./utils";

// Helper function to validate and sanitize note data according to Appwrite schema
function sanitizeNoteData(data: any): any {
  return {
    userId: String(data.userId || '').substring(0, 255),
    title: String(data.title || 'Untitled').substring(0, 500),
    content: String(data.content || '').substring(0, 10000),
    tags: Array.isArray(data.tags) ? data.tags : [],
    pinned: Boolean(data.pinned),
    archived: Boolean(data.archived),
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    version: Number(data.version) || 1,
    isDeleted: Boolean(data.isDeleted),
  };
}

export class NotesService {
  async createNote(
    userId: string,
    title: string,
    content: string = "",
  ): Promise<Note> {
    const tags = extractTags(content);
    const noteData = sanitizeNoteData({
      userId,
      title: title || "Untitled",
      content,
      tags,
      pinned: false,
      archived: false,
      attachments: [],
      version: 1,
      isDeleted: false,
    });

    try {
      // Try to create online first
      const note = (await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        ID.unique(),
        noteData,
      )) as unknown as Note;

      // Save to offline DB
      await db.saveNote(note);
      return note;
    } catch (error) {
      // Create offline note
      const offlineNote: Note = {
        $id: generateId(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.saveNote(offlineNote);
      await db.addToSyncQueue("create", offlineNote.$id, offlineNote);
      return offlineNote;
    }
  }

  async updateNote(
    noteId: string,
    updates: Partial<Note>,
  ): Promise<Note | null> {
    // Extract tags if content was updated
    if (updates.content) {
      updates.tags = extractTags(updates.content);
    }

    const updatedData = sanitizeNoteData(updates);

    try {
      // Try to update online first
      const note = (await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        noteId,
        updatedData,
      )) as unknown as Note;

      // Update offline DB
      await db.saveNote(note);
      return note;
    } catch (error) {
      // Update offline note
      const existingNote = await db.notes.where("$id").equals(noteId).first();
      if (existingNote) {
        const updatedNote = { ...existingNote, ...updatedData };
        await db.saveNote(updatedNote);
        await db.addToSyncQueue("update", noteId, updatedData);
        return updatedNote;
      }
      return null;
    }
  }

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      // Try to delete online first
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.NOTES, noteId, {
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      });

      // Update offline DB
      const existingNote = await db.notes.where("$id").equals(noteId).first();
      if (existingNote) {
        await db.saveNote({ ...existingNote, isDeleted: true });
      }
      return true;
    } catch (error) {
      console.log("Deleting note offline:", error);
      // Delete offline note
      const existingNote = await db.notes.where("$id").equals(noteId).first();
      if (existingNote) {
        await db.saveNote({ ...existingNote, isDeleted: true });
        await db.addToSyncQueue("delete", noteId, { isDeleted: true });
      }
      return true;
    }
  }

  async getNotes(userId: string): Promise<Note[]> {
    let onlineNotes: Note[] = [];
    
    try {
      // Try to get online notes first
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        [
          Query.equal("userId", userId),
          Query.orderDesc("$updatedAt"),
          Query.limit(100),
        ],
      );

      onlineNotes = response.documents as unknown as Note[];

      // Save to offline DB
      for (const note of onlineNotes) {
        await db.saveNote(note);
        await db.markSynced(note.$id);
      }
    } catch (error) {
      // Online notes failed, continue with offline notes
    }

    // Always get offline notes as well
    const offlineNotes = await db.getNotes(userId);
    
    // Merge online and offline notes, removing duplicates
    const allNotes = [...onlineNotes];
    const onlineNoteIds = new Set(onlineNotes.map(note => note.$id));
    
    // Add offline notes that aren't already in online notes
    for (const offlineNote of offlineNotes) {
      if (!onlineNoteIds.has(offlineNote.$id)) {
        allNotes.push(offlineNote);
      }
    }
    
    // Sort by updatedAt descending
    return allNotes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async syncNotes(userId: string): Promise<void> {
    try {
      // Get dirty notes that need syncing
      const dirtyNotes = await db.getDirtyNotes(userId);
      const syncQueue = await db.getSyncQueue();

      // Process sync queue
      for (const item of syncQueue) {
        try {
          switch (item.operation) {
            case "create":
              await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.NOTES,
                item.data.$id,
                item.data,
              );
              break;
            case "update":
              await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.NOTES,
                item.data.noteId,
                item.data,
              );
              break;
            case "delete":
              await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.NOTES,
                item.data.noteId,
                item.data,
              );
              break;
          }

          await db.removeSyncItem(item.id!);
          if (item.data.noteId) {
            await db.markSynced(item.data.noteId);
          }
        } catch (error) {
          console.error("Sync error for item:", item, error);
        }
      }
    } catch (error) {
      console.error("Sync notes error:", error);
    }
  }
}

export const notesService = new NotesService();
