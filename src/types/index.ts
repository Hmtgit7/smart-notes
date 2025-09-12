export interface User {
  $id: string;
  userId: string;
  name: string;
  email: string;
  title?: string; // Add title field if required by collection
  content?: string; // Add content field if required by collection
  tags?: string[]; // Add tags field if required by collection
  pinned?: boolean; // Add pinned field if required by collection
  archived?: boolean; // Add archived field if required by collection
  attachments?: string[]; // Add attachments field if required by collection
  version?: number; // Add version field if required by collection
  isDeleted?: boolean; // Add isDeleted field if required by collection
  avatar?: string;
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
  view: "grid" | "list";

  // Sync & Offline
  isOnline: boolean;
  syncStatus: "idle" | "syncing" | "error";
  pendingSyncs: number;

  // Search & Filters
  searchQuery: string;
  sidebarSearchQuery: string;
  navSearchQuery: string;
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
