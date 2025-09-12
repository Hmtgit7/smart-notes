'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Search, 
  Plus, 
  Settings, 
  LogOut, 
  Menu,
  X,
  FileText,
  Star,
  Archive,
  Trash2,
  Edit3,
} from 'lucide-react'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { 
    user, 
    sidebarOpen, 
    setSidebarOpen, 
    notes, 
    sidebarFilteredNotes,
    setSidebarSearchQuery,
    sidebarSearchQuery,
    setView,
    view
  } = useStore()

  const handleLogout = async () => {
    await authService.logout()
                router.push('/auth')
  }

  const handleNewNote = () => {
    // Create new note logic here
    router.push('/app/note/new')
  }

  // Helper functions to determine active state
  const isAllNotesActive = () => {
    return (pathname === '/app' && !searchParams.get('filter')) || pathname.startsWith('/app/note/')
  }

  const isPinnedActive = () => {
    return pathname === '/app' && searchParams.get('filter') === 'pinned'
  }

  const isArchivedActive = () => {
    return pathname === '/app' && searchParams.get('filter') === 'archived'
  }

  const isSettingsActive = () => {
    return pathname === '/app/settings'
  }

  const pinnedNotes = notes.filter(note => note.pinned && !note.isDeleted)
  const recentNotes = notes
    .filter(note => !note.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  
  // Show filtered notes when searching, otherwise show recent notes
  const displayNotes = sidebarSearchQuery ? sidebarFilteredNotes() : recentNotes

  return (
    <div className={`bg-white border-r border-border flex flex-col transition-all duration-300 fixed left-0 top-0 h-full z-40 ${
      sidebarOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-lg font-semibold text-gray-900">Smart Notes</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {sidebarOpen && user && (
        <div className="p-7 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {sidebarOpen && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={sidebarSearchQuery}
              onChange={(e) => setSidebarSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 py-7 border-b border-border">
        <Button
          onClick={handleNewNote}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white"
          size="sm"
        >
          {sidebarOpen ? (
            <>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </>
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <nav className="p-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isAllNotesActive() ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' : ''}`}
              onClick={() => router.push('/app')}
            >
              <Home className={`h-4 w-4 mr-3 ${isAllNotesActive() ? 'text-primary-600' : ''}`} />
              {sidebarOpen && 'All Notes'}
            </Button>
            
            <Button
              variant="ghost"
              className={`w-full justify-start ${isPinnedActive() ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' : ''}`}
              onClick={() => router.push('/app?filter=pinned')}
            >
              <Star className={`h-4 w-4 mr-3 ${isPinnedActive() ? 'text-primary-600' : ''}`} />
              {sidebarOpen && (
                <>
                  Pinned
                  {pinnedNotes.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {pinnedNotes.length}
                    </Badge>
                  )}
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className={`w-full justify-start ${isArchivedActive() ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' : ''}`}
              onClick={() => router.push('/app?filter=archived')}
            >
              <Archive className={`h-4 w-4 mr-3 ${isArchivedActive() ? 'text-primary-600' : ''}`} />
              {sidebarOpen && 'Archived'}
            </Button>
          </div>

          {/* Recent Notes / Search Results */}
          {sidebarOpen && displayNotes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {sidebarSearchQuery ? 'Search Results' : 'Recent'}
              </h3>
              <div className="space-y-1">
                {displayNotes.map((note) => (
                  <div
                    key={note.$id}
                    className="group relative flex items-center hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-2 flex-1"
                      onClick={() => router.push(`/app/note/${note.$id}`)}
                    >
                      <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate text-sm">{note.title}</span>
                    </Button>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/app/note/${note.$id}`)
                        }}
                        title="Edit note"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-red-100 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Add delete functionality here
                          console.log('Delete note:', note.$id)
                        }}
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start ${isSettingsActive() ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' : ''}`}
          onClick={() => router.push('/app/settings')}
        >
          <Settings className={`h-4 w-4 mr-3 ${isSettingsActive() ? 'text-primary-600' : ''}`} />
          {sidebarOpen && 'Settings'}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          {sidebarOpen && 'Sign Out'}
        </Button>
            </div>
        </div>
    )
}
