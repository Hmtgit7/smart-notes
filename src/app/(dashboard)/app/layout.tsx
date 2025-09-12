'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { notesService } from '@/lib/notes'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/top-bar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ProtectedRoute } from '@/components/protected-route'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    const [isLoadingNotes, setIsLoadingNotes] = useState(true)
    const { user, setNotes, sidebarOpen } = useStore()
    const { isAuthenticated } = useAuth()

    // Load notes when user is authenticated
    useEffect(() => {
        const loadNotes = async () => {
            if (!isAuthenticated || !user) {
                setIsLoadingNotes(false)
                return
            }

            try {
                // Load user's notes
                const userNotes = await notesService.getNotes(user.userId)
                setNotes(userNotes)
            } catch (error) {
                console.error('Error loading notes:', error)
            } finally {
                setIsLoadingNotes(false)
            }
        }

        loadNotes()
    }, [isAuthenticated, user, setNotes])

    if (isLoadingNotes) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <ProtectedRoute>
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
        </ProtectedRoute>
    )
}