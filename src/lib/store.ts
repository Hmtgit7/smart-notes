import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Note, AppState } from "@/types";
import { authService } from "./auth";

interface NotesStore extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;

  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setView: (view: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;

  // Sync Actions
  setSyncStatus: (status: "idle" | "syncing" | "error") => void;
  setOnlineStatus: (online: boolean) => void;
  incrementPendingSyncs: () => void;
  decrementPendingSyncs: () => void;

  // Computed getters
  filteredNotes: () => Note[];
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
      theme: "system",
      view: "grid",
      isOnline: true,
      syncStatus: "idle",
      pendingSyncs: 0,
      searchQuery: "",
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

      deleteNote: (id) =>
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
        })),

      togglePin: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.$id === id
              ? {
                  ...note,
                  pinned: !note.pinned,
                  updatedAt: new Date().toISOString(),
                }
              : note,
          ),
        })),

      toggleArchive: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.$id === id
              ? {
                  ...note,
                  archived: !note.archived,
                  updatedAt: new Date().toISOString(),
                }
              : note,
          ),
        })),

      setCurrentNote: (note) => set({ currentNote: note }),

      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setView: (view) => set({ view }),
      setSearchQuery: (query) => set({ searchQuery: query }),
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
        theme: state.theme,
        view: state.view,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
