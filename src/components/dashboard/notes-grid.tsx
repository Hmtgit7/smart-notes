'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, truncateText } from '@/lib/utils'
import {
    Pin,
    Star,
    Trash2,
    Edit3,
    Calendar,
    Tag as TagIcon,
    Wifi,
    WifiOff,
    Archive
} from 'lucide-react'
import Link from 'next/link'
import type { Note } from '@/types'
import { cn } from '@/lib/utils'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

interface NoteCardProps {
    note: Note
    onPin: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onArchive: (id: string) => Promise<void>
}

function NoteCard({ note, onPin, onDelete, onArchive }: NoteCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDelete = async () => {
        await onDelete(note.$id)
    }

    return (
        <>
            <Card className={cn(
                "group hover:shadow-md transition-all duration-200 cursor-pointer",
                note.pinned && "ring-2 ring-primary-200 bg-primary-50/50"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            {note.pinned && (
                                <Pin className="h-4 w-4 text-primary-500" />
                            )}
                            {note.dirty && (
                                <div className="flex items-center text-orange-500">
                                    <WifiOff className="h-3 w-3" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-blue-50"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.location.href = `/app/note/${note.$id}`
                                }}
                                title="Edit note"
                            >
                                <Edit3 className="h-4 w-4 text-blue-600" />
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-yellow-50"
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    await onPin(note.$id)
                                }}
                                title={note.pinned ? 'Unpin note' : 'Pin note'}
                            >
                                <Star className={cn("h-4 w-4", note.pinned ? "text-yellow-500 fill-current" : "text-gray-600")} />
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-gray-50"
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    await onArchive(note.$id)
                                }}
                                title={note.archived ? 'Unarchive note' : 'Archive note'}
                            >
                                <Archive className={cn("h-4 w-4", note.archived ? "text-gray-500 fill-current" : "text-gray-600")} />
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDeleteModal(true)
                                }}
                                title="Delete note"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    </div>

                <Link href={`/app/note/${note.$id}`} className="block">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {note.title}
                    </h3>

                    {note.content && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {truncateText(note.content, 150)}
                        </p>
                    )}

                    {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {note.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {note.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{note.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </Link>
            </CardContent>

            <CardFooter className="px-4 py-3 pt-0 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                </div>

                {note.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                        <TagIcon className="h-3 w-3" />
                        <span>{note.tags.length}</span>
                    </div>
                )}
            </CardFooter>
        </Card>

        <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Note"
            description={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="destructive"
        />
        </>
    )
}

interface NotesGridProps {
    notes?: Note[]
}

export function NotesGrid({ notes: propNotes }: NotesGridProps = {}) {
    const { notes: storeNotes, view, togglePin, deleteNote, toggleArchive } = useStore()
    const displayNotes = propNotes || storeNotes.filter(note => !note.isDeleted && !note.archived)

    if (displayNotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Edit3 className="h-12 w-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                <p className="text-sm text-center max-w-sm">
                    Create your first note to get started with Smart Notes
                </p>
                <Link href="/app/note/new" className="mt-4">
                    <Button>Create Note</Button>
                </Link>
            </div>
        )
    }

    if (view === 'list') {
        return (
            <div className="space-y-2">
                {displayNotes.map((note) => (
                    <Card key={note.$id} className="hover:shadow-sm transition-shadow">
                        <Link href={`/app/note/${note.$id}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            {note.pinned && <Pin className="h-4 w-4 text-primary-500" />}
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {note.title}
                                            </h3>
                                            {note.dirty && <WifiOff className="h-3 w-3 text-orange-500" />}
                                        </div>

                                        <p className="text-sm text-gray-600 truncate">
                                            {truncateText(note.content, 100)}
                                        </p>

                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-xs text-gray-500">
                                                {formatDate(note.updatedAt)}
                                            </span>
                                            {note.tags.length > 0 && (
                                                <div className="flex items-center space-x-1">
                                                    <TagIcon className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {note.tags.slice(0, 2).join(', ')}
                                                        {note.tags.length > 2 && ` +${note.tags.length - 2}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                window.location.href = `/app/note/${note.$id}`
                                            }}
                                            title="Edit note"
                                        >
                                            <Edit3 className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-yellow-50"
                                            onClick={async (e) => {
                                                e.preventDefault()
                                                await togglePin(note.$id)
                                            }}
                                            title={note.pinned ? 'Unpin note' : 'Pin note'}
                                        >
                                            <Star className={cn("h-4 w-4", note.pinned ? "text-yellow-500 fill-current" : "text-gray-600")} />
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-gray-50"
                                            onClick={async (e) => {
                                                e.preventDefault()
                                                await toggleArchive(note.$id)
                                            }}
                                            title={note.archived ? 'Unarchive note' : 'Archive note'}
                                        >
                                            <Archive className={cn("h-4 w-4", note.archived ? "text-gray-500 fill-current" : "text-gray-600")} />
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                // We'll need to add state management for the modal here
                                                if (confirm(`Are you sure you want to delete "${note.title}"? This action cannot be undone.`)) {
                                                    deleteNote(note.$id)
                                                }
                                            }}
                                            title="Delete note"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayNotes.map((note) => (
                <NoteCard
                    key={note.$id}
                    note={note}
                    onPin={togglePin}
                    onDelete={deleteNote}
                    onArchive={toggleArchive}
                />
            ))}
        </div>
    )
}
