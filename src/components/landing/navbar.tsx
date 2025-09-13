'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Brain } from 'lucide-react'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsOpen(false) // Close mobile menu after navigation
    }

    return (
        <nav className={`fixed top-0 w-full transition-all duration-300 z-50 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
                : 'bg-white/80 backdrop-blur-md border-b border-gray-200'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="p-2 bg-primary-500 rounded-lg">
                                <Brain className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">SmartNotes</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Features
                            </button>
                            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Pricing
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                How it Works
                            </button>
                        </div>
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            <Link href="/auth">
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth">
                                <Button className="bg-primary-500 hover:bg-primary-600">
                                    Start for Free
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            {isOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-b shadow-lg">
                        <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                            Pricing
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                            How it Works
                        </button>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-3 space-x-3">
                                <Link href="/auth" className="w-full">
                                    <Button variant="outline" className="w-full mb-2">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                            <div className="px-3">
                                <Link href="/auth" className="w-full">
                                    <Button className="w-full bg-primary-500 hover:bg-primary-600">
                                        Start for Free
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
