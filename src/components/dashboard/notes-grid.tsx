'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, truncateText } from '@/lib/utils'
import {
    Pin,
    MoreVertical,
    Star,
    Trash2,
    Edit3,
    Calendar,
    Tag as TagIcon,
    Wifi,
    WifiOff,
    Archive
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { Note } from '@/types'
import { cn } from '@/lib/utils'

interface NoteCardProps {
    note: Note
    onPin: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onArchive: (id: string) => Promise<void>
}

function NoteCard({ note, onPin, onDelete, onArchive }: NoteCardProps) {
    return (
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-100 hover:bg-gray-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.location.href = `/app/note/${note.$id}`
                                }}
                                className="cursor-pointer"
                            >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Note
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    await onPin(note.$id)
                                }}
                                className="cursor-pointer"
                            >
                                <Star className="mr-2 h-4 w-4" />
                                {note.pinned ? 'Unpin' : 'Pin'} Note
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    await onArchive(note.$id)
                                }}
                                className="cursor-pointer"
                            >
                                <Archive className="mr-2 h-4 w-4" />
                                {note.archived ? 'Unarchive' : 'Archive'} Note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    await onDelete(note.$id)
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Note
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={async (e) => {
                                                e.preventDefault()
                                                await togglePin(note.$id)
                                            }}>
                                                <Star className="mr-2 h-4 w-4" />
                                                {note.pinned ? 'Unpin' : 'Pin'} Note
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    await deleteNote(note.$id)
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Note
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
