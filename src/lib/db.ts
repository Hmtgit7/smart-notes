import Dexie, { Table } from "dexie";
import type { Note, SyncItem } from "@/types";

export interface OfflineNote extends Note {
  localId?: string;
  dirty?: boolean;
  lastSynced?: string;
}

export class SmartNotesDB extends Dexie {
  notes!: Table<OfflineNote>;
  syncQueue!: Table<SyncItem>;

  constructor() {
    super("SmartNotesDB");

    this.version(1).stores({
      notes:
        "++localId, $id, userId, title, content, updatedAt, dirty, tags, pinned, isDeleted",
      syncQueue: "++id, operation, noteId, data, timestamp, retries",
    });
  }

  async saveNote(note: OfflineNote) {
    const existing = await this.notes.where("$id").equals(note.$id).first();

    if (existing) {
      return await this.notes.update(existing.localId!, {
        ...note,
        dirty: true,
        updatedAt: new Date().toISOString(),
      });
    } else {
      return await this.notes.add({
        ...note,
        dirty: true,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async getNotes(userId: string) {
    return await this.notes
      .where("userId")
      .equals(userId)
      .and((note) => !note.isDeleted)
      .toArray();
  }

  async getDirtyNotes(userId: string) {
    return await this.notes
      .where("userId")
      .equals(userId)
      .and((note) => !!note.dirty)
      .toArray();
  }

  async markSynced(noteId: string) {
    const note = await this.notes.where("$id").equals(noteId).first();
    if (note) {
      await this.notes.update(note.localId!, {
        dirty: false,
        lastSynced: new Date().toISOString(),
      });
    }
  }

  async addToSyncQueue(
    operation: "create" | "update" | "delete",
    noteId: string,
    data: any,
  ) {
    return await this.syncQueue.add({
      operation,
      data: { ...data, noteId },
      timestamp: Date.now(),
      retries: 0,
    });
  }

  async getSyncQueue() {
    return await this.syncQueue.orderBy("timestamp").toArray();
  }

  async removeSyncItem(id: number) {
    return await this.syncQueue.delete(id);
  }

  async clearSyncQueue() {
    return await this.syncQueue.clear();
  }
}

export const db = new SmartNotesDB();
