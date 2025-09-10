'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { authService } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/top-bar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Temporarily commented out for UI testing
    // const [isLoading, setIsLoading] = useState(true)
    // const router = useRouter()
    const { user, setUser, sidebarOpen } = useStore()

    // Mock user and notes for UI testing
    useEffect(() => {
        if (!user) {
            setUser({
                $id: 'mock-user-id',
                userId: 'mock-user-id',
                name: 'Test User',
                email: 'test@example.com',
                theme: 'system' as const,
                plan: 'free' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
        }
    }, [user, setUser])

    // Add mock notes for testing
    useEffect(() => {
        const { notes, setNotes } = useStore.getState()
        console.log('Current notes in store:', notes.length)
        if (notes.length === 0) {
            const mockNotes = [
                {
                    $id: 'note-1',
                    userId: 'mock-user-id',
                    title: 'Project Ideas',
                    content: 'AI-enhanced brainstorming session for the new mobile app. Need to focus on user experience and accessibility features.',
                    tags: ['work', 'ideas', 'mobile'],
                    pinned: false,
                    archived: false,
                    attachments: [],
                    version: 1,
                    isDeleted: false,
                    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
                    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
                },
                {
                    $id: 'note-2',
                    userId: 'mock-user-id',
                    title: 'Meeting Notes',
                    content: 'Summary of today\'s team standup with action items. Need to follow up on the design review and prepare for the client presentation.',
                    tags: ['meeting', 'work', 'action-items'],
                    pinned: true,
                    archived: false,
                    attachments: [],
                    version: 1,
                    isDeleted: false,
                    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                },
                {
                    $id: 'note-3',
                    userId: 'mock-user-id',
                    title: 'Research Notes',
                    content: 'Collecting insights on user experience patterns and best practices for modern web applications.',
                    tags: ['research', 'ux', 'web'],
                    pinned: false,
                    archived: false,
                    attachments: [],
                    version: 1,
                    isDeleted: false,
                    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
                    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                },
                {
                    $id: 'note-4',
                    userId: 'mock-user-id',
                    title: 'Shopping List',
                    content: 'Grocery items for the weekend: milk, bread, eggs, vegetables, and some snacks for the movie night.',
                    tags: ['personal', 'shopping'],
                    pinned: false,
                    archived: false,
                    attachments: [],
                    version: 1,
                    isDeleted: false,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                    $id: 'note-5',
                    userId: 'mock-user-id',
                    title: 'Learning Goals',
                    content: 'This month I want to focus on learning React advanced patterns, TypeScript best practices, and improving my design skills.',
                    tags: ['learning', 'goals', 'development'],
                    pinned: false,
                    archived: false,
                    attachments: [],
                    version: 1,
                    isDeleted: false,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                }
            ]
            console.log('Setting mock notes:', mockNotes.length)
            setNotes(mockNotes)
        }
    }, [])

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const currentUser = await authService.getCurrentUser()
    //             if (currentUser) {
    //                 setUser(currentUser)
    //             } else {
    //                 router.push('/auth')
    //                 return
    //             }
    //         } catch (error) {
    //             router.push('/auth')
    //             return
    //         }
    //         setIsLoading(false)
    //     }

    //     checkAuth()
    // }, [router, setUser])

    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <LoadingSpinner />
    //         </div>
    //     )
    // }

    // if (!user) {
    //     return null
    // }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* TopBar spans full width */}
            <TopBar />
            
            {/* Main content area with sidebar */}
            <div className="flex-1 flex relative">
                <Sidebar />

                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                    <main className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
