'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Home, ArrowLeft, Search, FileText, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100 opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-100 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-50 opacity-40"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Number with Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <h1 className="text-8xl sm:text-9xl font-bold text-primary-600 opacity-20 select-none">
                404
              </h1>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-16 h-16 text-primary-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, even the best notes sometimes get misplaced!
            </p>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {/* Primary Actions */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-primary-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Go Home
              </h3>
              <p className="text-gray-600 mb-4">
                Return to your dashboard and continue organizing your notes
              </p>
              <Link href="/app">
                <Button className="w-full bg-primary-500 hover:bg-primary-600">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ArrowLeft className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Go Back
              </h3>
              <p className="text-gray-600 mb-4">
                Return to the previous page and continue your journey
              </p>
              <Button 
                variant="outline" 
                className="w-full border-emerald-200 hover:bg-emerald-50"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/app">
              <Button variant="ghost" className="text-gray-600 hover:text-primary-600">
                <FileText className="w-4 h-4 mr-2" />
                My Notes
              </Button>
            </Link>
            <Link href="/app/settings">
              <Button variant="ghost" className="text-gray-600 hover:text-primary-600">
                <Search className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 hover:text-primary-600">
                <Home className="w-4 h-4 mr-2" />
                Landing Page
              </Button>
            </Link>
          </motion.div>

          {/* Fun Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200"
          >
            <p className="text-sm text-gray-500 italic">
              💡 Pro tip: Use the search feature to quickly find your notes, or create a new one to capture your thoughts!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
