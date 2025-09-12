'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import {
    Search,
    Grid3X3,
    List,
    Wifi,
    WifiOff,
    RefreshCw,
    User,
    Settings,
    LogOut
} from 'lucide-react'

export function TopBar() {
    const router = useRouter()
    const {
        user,
        searchQuery,
        setSearchQuery,
        view,
        setView,
        isOnline,
        syncStatus,
        pendingSyncs,
        sidebarOpen
    } = useStore()
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    }


    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 w-full">
            <div className="flex items-center justify-between w-full">
                {/* Search - positioned to account for fixed sidebar */}
                <div className={`flex-1 max-w-lg transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 ml-6">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                            size="sm"
                            variant={view === 'grid' ? 'default' : 'ghost'}
                            onClick={() => setView('grid')}
                            className="px-3 py-1"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={view === 'list' ? 'default' : 'ghost'}
                            onClick={() => setView('list')}
                            className="px-3 py-1"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Sync Status */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {isOnline ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}

                        {syncStatus === 'syncing' && (
                            <div className="flex items-center space-x-1">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Syncing...</span>
                            </div>
                        )}

                        {pendingSyncs > 0 && (
                            <div className="flex items-center space-x-1">
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                                    {pendingSyncs} pending
                                </span>
                            </div>
                        )}
                    </div>


                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                    <AvatarFallback>
                                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium">{user?.name || 'User'}</p>
                                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/app/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
