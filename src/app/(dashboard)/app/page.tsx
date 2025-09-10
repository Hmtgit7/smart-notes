'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { notesService } from '@/lib/notes'
import { NotesGrid } from '@/components/dashboard/notes-grid'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Filter } from 'lucide-react'

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()
    const { user, notes, setNotes, filteredNotes, searchQuery } = useStore()

    const filter = searchParams.get('filter')
    const tag = searchParams.get('tag')

    useEffect(() => {
        // Skip loading since we're using mock data
        setIsLoading(false)
    }, [])

    // Apply filters based on URL params
    const getFilteredNotes = () => {
        let filtered = filteredNotes()

        if (filter === 'pinned') {
            filtered = filtered.filter(note => note.pinned && !note.isDeleted)
        } else if (filter === 'trash') {
            filtered = filtered.filter(note => note.isDeleted)
        } else if (filter === 'archived') {
            filtered = filtered.filter(note => note.archived && !note.isDeleted)
        }

        if (tag) {
            filtered = filtered.filter(note => note.tags.includes(tag))
        }

        return filtered
    }

    const displayNotes = getFilteredNotes()

    const getPageTitle = () => {
        if (filter === 'pinned') return 'Pinned Notes'
        if (filter === 'trash') return 'Trash'
        if (filter === 'archived') return 'Archived Notes'
        if (filter === 'tags') return 'All Tags'
        if (tag) return `Tagged: ${tag}`
        if (searchQuery) return `Search: ${searchQuery}`
        return 'All Notes'
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            {/* Page Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {displayNotes.length} {displayNotes.length === 1 ? 'note' : 'notes'}
                            {searchQuery && ` found for "${searchQuery}"`}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link href="/app/note/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Note
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Notes Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <NotesGrid />
                </div>
            </div>
        </div>
    )
}
