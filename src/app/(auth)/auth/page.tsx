'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { Brain } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center space-x-2 mb-4">
                        <div className="p-3 bg-primary-500 rounded-xl">
                            <Brain className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Smart Notes</span>
                    </Link>
                    <p className="text-gray-600 text-center">
                        Welcome back! Please sign in to your account.
                    </p>
                </div>


                {/* Auth Forms */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>

                    <TabsContent value="signup">
                        <SignupForm />
                    </TabsContent>
                </Tabs>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        ← Back to home
                    </Link>
                </div>

            </div>
        </div>
    )
}
