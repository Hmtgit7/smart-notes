export interface User {
  $id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  theme: "light" | "dark" | "system";
  plan: "free" | "pro";
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  $id: string;
  userId: string;
  title: string;
  content: string; // Markdown content
  tags: string[];
  pinned: boolean;
  archived: boolean;
  attachments: string[]; // Appwrite file IDs
  version: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Local-only fields for offline support
  dirty?: boolean; // Has unsaved changes
  localId?: string; // For offline creation
}

export interface NoteVersion {
  $id: string;
  noteId: string;
  title: string;
  content: string;
  version: number;
  createdAt: string;
}

export interface AIEnhancement {
  $id: string;
  userId: string;
  noteId: string;
  type: "enhance" | "summarize" | "title" | "grammar" | "tone";
  input: string;
  output: string;
  tokensUsed: number;
  createdAt: string;
}

export interface SyncItem {
  id?: number;
  operation: "create" | "update" | "delete";
  data: any;
  timestamp: number;
  retries: number;
}

// UI State types
export interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;

  // Notes
  notes: Note[];
  currentNote: Note | null;
  selectedNotes: string[];

  // UI State
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  view: "grid" | "list";

  // Sync & Offline
  isOnline: boolean;
  syncStatus: "idle" | "syncing" | "error";
  pendingSyncs: number;

  // Search & Filters
  searchQuery: string;
  selectedTags: string[];
  showDeleted: boolean;
}

// Component Props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
