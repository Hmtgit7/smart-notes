'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { extractTags } from '@/lib/utils'
import { Pin, Tag as TagIcon, Calendar, Hash, Sparkles, Save } from 'lucide-react'
import type { Note } from '@/types'
import { formatDateTime } from '@/lib/utils'
import { AIPanel } from './ai-panel'

interface NoteEditorProps {
    note: Note
    onChange: (updates: Partial<Note>) => void
    onSave?: () => void
    isSaving?: boolean
}

export function NoteEditor({ note, onChange, onSave, isSaving }: NoteEditorProps) {
    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content)
    const [activeTab, setActiveTab] = useState('editor')

    // Update local state when note prop changes
    useEffect(() => {
        setTitle(note.title)
        setContent(note.content)
    }, [note.title, note.content])

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        onChange({ title: newTitle })
    }, [onChange])

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setContent(newContent)
        const tags = extractTags(newContent)
        onChange({ content: newContent, tags })
    }, [onChange])

    const handleTogglePin = useCallback(() => {
        onChange({ pinned: !note.pinned })
    }, [note.pinned, onChange])

    const handleInsertContent = useCallback((newContent: string) => {
        const updatedContent = content + '\n\n' + newContent
        setContent(updatedContent)
        const tags = extractTags(updatedContent)
        onChange({ content: updatedContent, tags })
    }, [content, onChange])


    return (
        <div className="h-full flex flex-col">
            {/* Note Header */}
            <div className="flex-shrink-0 px-6 py-4 space-y-4">
                {/* Title */}
                <div className="flex items-center space-x-4">
                    <Input
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Note title..."
                        className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
                    />
                    <Button
                        variant={note.pinned ? 'default' : 'outline'}
                        size="icon"
                        onClick={handleTogglePin}
                    >
                        <Pin className="h-4 w-4" />
                    </Button>
                    {onSave && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={onSave}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {formatDateTime(note.updatedAt)}</span>
                        </div>
                        {note.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                                <TagIcon className="h-4 w-4" />
                                <span>{note.tags.length} tags</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <span>{content.length} characters</span>
                    </div>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-sm">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs for Editor and AI */}
            <div className="flex-1 px-6 pb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor" className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Editor
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Assistant
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor" className="flex-1 mt-4">
                        <Textarea
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Start writing your note..."
                            className="h-full resize-none border-none shadow-none text-base leading-relaxed focus-visible:ring-0"
                        />
                    </TabsContent>
                    
                    <TabsContent value="ai" className="flex-1 mt-4 overflow-auto">
                        <AIPanel
                            content={content}
                            onInsertContent={handleInsertContent}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
