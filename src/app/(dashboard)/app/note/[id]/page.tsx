'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { notesService } from '@/lib/notes'
import { NoteEditor } from '@/components/editor/note-editor'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Share, MoreHorizontal } from 'lucide-react'
import type { Note } from '@/types'
// import { debounce } from '@/lib/utils'

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function NotePage() {
    const { id } = useParams()
    const router = useRouter()
    const [note, setNote] = useState<Note | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { user, updateNote: updateStoreNote, notes } = useStore()

    // Create debounced save function
    const debouncedSave = debounce(async (noteId: string, updates: Partial<Note>) => {
        setIsSaving(true)
        try {
            // For mock data, just update the store
            updateStoreNote(noteId, updates)
            console.log('Note saved (mock):', updates)
        } catch (error) {
            console.error('Error saving note:', error)
        } finally {
            setIsSaving(false)
        }
    }, 1000)

    useEffect(() => {
        const loadNote = async () => {
            if (!user || !id) return

            try {
                if (id === 'new') {
                    // Create new note with mock data
                    const newNote: Note = {
                        $id: 'new-note-' + Date.now(),
                        userId: user.userId,
                        title: 'Untitled Note',
                        content: '',
                        tags: [],
                        pinned: false,
                        archived: false,
                        attachments: [],
                        version: 1,
                        isDeleted: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                    setNote(newNote)
                    // Replace URL without triggering navigation
                    window.history.replaceState({}, '', `/app/note/${newNote.$id}`)
                } else {
                    // Load existing note from store
                    const foundNote = notes.find(n => n.$id === id)
                    if (foundNote) {
                        setNote(foundNote)
                    } else {
                        router.push('/app')
                    }
                }
            } catch (error) {
                console.error('Error loading note:', error)
                router.push('/app')
            } finally {
                setIsLoading(false)
            }
        }

        loadNote()
    }, [id, user, router])

    const handleNoteChange = (updates: Partial<Note>) => {
        if (!note) return

        const updatedNote = { ...note, ...updates }
        setNote(updatedNote)

        // Auto-save after user stops typing
        debouncedSave(note.$id, updates)
    }

    const handleBack = () => {
        router.push('/app')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!note) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                    <p className="mb-4">Note not found</p>
                    <Button onClick={handleBack}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Editor Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                            {isSaving && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Saving...
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <NoteEditor note={note} onChange={handleNoteChange} />
            </div>
        </div>
    )
}
