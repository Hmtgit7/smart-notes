'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { notesService } from '@/lib/notes'
import { NotesGrid } from '@/components/dashboard/notes-grid'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Filter } from 'lucide-react'

function DashboardContent() {
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()
    const { user, notes, setNotes, filteredNotes, navSearchQuery } = useStore()

    const filter = searchParams.get('filter')
    const tag = searchParams.get('tag')

    useEffect(() => {
        // Notes are loaded in the layout, just set loading to false
        setIsLoading(false)
    }, [])

    // Apply filters based on URL params and nav search
    const getFilteredNotes = () => {
        let filtered = notes.filter(note => !note.isDeleted)

        // Apply page-specific filters first
        if (filter === 'pinned') {
            filtered = filtered.filter(note => note.pinned && !note.isDeleted)
        } else if (filter === 'trash') {
            filtered = filtered.filter(note => note.isDeleted)
        } else if (filter === 'archived') {
            filtered = filtered.filter(note => note.archived && !note.isDeleted)
        } else {
            // Default: filter out archived notes
            filtered = filtered.filter(note => !note.archived)
        }

        // Apply tag filter
        if (tag) {
            filtered = filtered.filter(note => note.tags.includes(tag))
        }

        // Apply nav search query
        if (navSearchQuery) {
            const query = navSearchQuery.toLowerCase()
            filtered = filtered.filter(
                note =>
                    note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query) ||
                    note.tags.some(tag => tag.toLowerCase().includes(query))
            )
        }

        // Sort by pinned first, then by updated date
        return filtered.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1
            if (!a.pinned && b.pinned) return 1
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        })
    }

    const displayNotes = getFilteredNotes()

    const getPageTitle = () => {
        if (filter === 'pinned') return navSearchQuery ? `Pinned Notes - Search: ${navSearchQuery}` : 'Pinned Notes'
        if (filter === 'trash') return navSearchQuery ? `Trash - Search: ${navSearchQuery}` : 'Trash'
        if (filter === 'archived') return navSearchQuery ? `Archived Notes - Search: ${navSearchQuery}` : 'Archived Notes'
        if (filter === 'tags') return 'All Tags'
        if (tag) return navSearchQuery ? `Tagged: ${tag} - Search: ${navSearchQuery}` : `Tagged: ${tag}`
        if (navSearchQuery) return `Search: ${navSearchQuery}`
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
                            {navSearchQuery && ` found for "${navSearchQuery}"`}
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
                    <NotesGrid notes={displayNotes} />
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}
