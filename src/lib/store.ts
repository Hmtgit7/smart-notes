import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Note, AppState } from "@/types";
import { notesService } from "./notes";
import { authService } from "./auth";

interface NotesStore extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  setCurrentNote: (note: Note | null) => void;

  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  setView: (view: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  setSidebarSearchQuery: (query: string) => void;
  setNavSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;

  // Sync Actions
  setSyncStatus: (status: "idle" | "syncing" | "error") => void;
  setOnlineStatus: (online: boolean) => void;
  incrementPendingSyncs: () => void;
  decrementPendingSyncs: () => void;

  // Computed getters
  filteredNotes: () => Note[];
  sidebarFilteredNotes: () => Note[];
  navFilteredNotes: () => Note[];
  pinnedNotes: () => Note[];
  recentNotes: () => Note[];
  allTags: () => string[];
}

export const useStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      notes: [],
      currentNote: null,
      selectedNotes: [],
      sidebarOpen: true,
      view: "grid",
      isOnline: true,
      syncStatus: "idle",
      pendingSyncs: 0,
      searchQuery: "",
      sidebarSearchQuery: "",
      navSearchQuery: "",
      selectedTags: [],
      showDeleted: false,

      // User & Auth Actions
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
        })),

      // Notes Actions
      setNotes: (notes) => set({ notes }),

      addNote: (note) =>
        set((state) => ({
          notes: [note, ...state.notes],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.$id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note,
          ),
          currentNote:
            state.currentNote?.$id === id
              ? {
                  ...state.currentNote,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentNote,
        })),

      deleteNote: async (id) => {
        try {
          // Delete in Appwrite
          const success = await notesService.deleteNote(id);
          
          if (success) {
            // Update local state
            set((state) => ({
              notes: state.notes.map((note) =>
                note.$id === id
                  ? {
                      ...note,
                      isDeleted: true,
                      updatedAt: new Date().toISOString(),
                    }
                  : note,
              ),
            }));
          }
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      },

      togglePin: async (id) => {
        const state = get();
        const note = state.notes.find(n => n.$id === id);
        if (!note) return;

        try {
          // Update in Appwrite
          const updatedNote = await notesService.updateNote(id, { 
            pinned: !note.pinned 
          });
          
          if (updatedNote) {
            // Update local state
            set((state) => ({
              notes: state.notes.map((note) =>
                note.$id === id ? updatedNote : note,
              ),
            }));
          }
        } catch (error) {
          console.error('Error toggling pin:', error);
        }
      },

      toggleArchive: async (id) => {
        const state = get();
        const note = state.notes.find(n => n.$id === id);
        if (!note) return;

        try {
          // Update in Appwrite
          const updatedNote = await notesService.updateNote(id, { 
            archived: !note.archived 
          });
          
          if (updatedNote) {
            // Update local state
            set((state) => ({
              notes: state.notes.map((note) =>
                note.$id === id ? updatedNote : note,
              ),
            }));
          }
        } catch (error) {
          console.error('Error toggling archive:', error);
        }
      },

      setCurrentNote: (note) => set({ currentNote: note }),

      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setView: (view) => set({ view }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSidebarSearchQuery: (query) => set({ sidebarSearchQuery: query }),
      setNavSearchQuery: (query) => set({ navSearchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),

      // Sync Actions
      setSyncStatus: (status) => set({ syncStatus: status }),
      setOnlineStatus: (online) => set({ isOnline: online }),
      incrementPendingSyncs: () =>
        set((state) => ({ pendingSyncs: state.pendingSyncs + 1 })),
      decrementPendingSyncs: () =>
        set((state) => ({ pendingSyncs: Math.max(0, state.pendingSyncs - 1) })),

      // Computed getters
      filteredNotes: () => {
        const state = get();
        let filtered = state.notes.filter(
          (note) => !note.isDeleted || state.showDeleted,
        );

        // Filter out archived notes by default (unless specifically viewing archived)
        filtered = filtered.filter((note) => !note.archived);

        // Use the main search query (for backward compatibility and main content filtering)
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags.some((tag) => tag.toLowerCase().includes(query)),
          );
        }

        if (state.selectedTags.length > 0) {
          filtered = filtered.filter((note) =>
            note.tags.some((tag) => state.selectedTags.includes(tag)),
          );
        }

        return filtered.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      },

      // Sidebar filtered notes (uses sidebar search query)
      sidebarFilteredNotes: () => {
        const state = get();
        let filtered = state.notes.filter(
          (note) => !note.isDeleted || state.showDeleted,
        );

        // Filter out archived notes by default
        filtered = filtered.filter((note) => !note.archived);

        // Use sidebar search query
        if (state.sidebarSearchQuery) {
          const query = state.sidebarSearchQuery.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags.some((tag) => tag.toLowerCase().includes(query)),
          );
        }

        return filtered.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      },

      // Navigation filtered notes (uses nav search query for page-specific filtering)
      navFilteredNotes: () => {
        const state = get();
        let filtered = state.notes.filter(
          (note) => !note.isDeleted || state.showDeleted,
        );

        // Use nav search query for page-specific filtering
        if (state.navSearchQuery) {
          const query = state.navSearchQuery.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags.some((tag) => tag.toLowerCase().includes(query)),
          );
        }

        return filtered.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      },

      pinnedNotes: () => {
        const state = get();
        return state.notes.filter((note) => note.pinned && !note.isDeleted);
      },

      recentNotes: () => {
        const state = get();
        return state.notes
          .filter((note) => !note.isDeleted)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, 5);
      },

      allTags: () => {
        const state = get();
        const tags = new Set<string>();
        state.notes.forEach((note) => {
          if (!note.isDeleted) {
            note.tags.forEach((tag) => tags.add(tag));
          }
        });
        return Array.from(tags).sort();
      },
    }),
    {
      name: "smart-notes-storage",
      partialize: (state) => ({
        user: state.user,
        view: state.view,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
