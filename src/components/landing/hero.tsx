'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Sparkles, Cloud, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50 pt-16">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100 opacity-60"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-100 opacity-60"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Note Taking
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Smart Notes for
                            <span className="text-primary-600 block">
                                Modern Minds
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                            Beautiful, offline-first notes application with AI enhancement.
                            Write, organize, and enhance your thoughts with the power of artificial intelligence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                            <Link href="/auth">
                                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="px-8 py-3">
                                Watch Demo
                            </Button>
                        </div>

                        {/* Feature highlights */}
                        <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
                            <div className="flex items-center">
                                <Cloud className="w-4 h-4 mr-2 text-primary-500" />
                                Offline First
                            </div>
                            <div className="flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-primary-500" />
                                Privacy Focused
                            </div>
                            <div className="flex items-center">
                                <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
                                AI Enhanced
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - App Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Main app mockup */}
                            <Card className="p-6 shadow-2xl bg-white/80 backdrop-blur-sm">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">My Notes</h3>
                                        <Button size="sm" className="bg-primary-500">
                                            + New Note
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-gray-50 border">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">Project Ideas</span>
                                                <span className="text-xs text-gray-500">2 min ago</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                AI-enhanced brainstorming session for the new mobile app...
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-lg bg-primary-50 border border-primary-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">Meeting Notes</span>
                                                <span className="text-xs text-primary-600">✨ AI Enhanced</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Summary of today's team standup with action items...
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-lg bg-gray-50 border">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">Research Notes</span>
                                                <span className="text-xs text-gray-500">1 hour ago</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Collecting insights on user experience patterns...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Floating AI panel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="absolute -right-6 -top-6 bg-white rounded-lg shadow-lg p-4 border border-primary-200"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-primary-500" />
                                    <span className="text-sm font-medium">AI Assistant</span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Suggest improvements for this note?
                                </p>
                                <Button size="sm" className="mt-2 w-full bg-primary-500 text-xs">
                                    Enhance
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
