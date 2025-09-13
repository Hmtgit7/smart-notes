'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Shield, 
  Cloud, 
  Search, 
  Smartphone, 
  Lock, 
  Sparkles,
  FileText,
  Users,
  Globe,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Brain,
    title: "AI-Powered Enhancement",
    description: "Get intelligent suggestions, auto-completion, and content enhancement powered by advanced AI.",
    badge: "Popular",
    color: "bg-purple-100 text-purple-700 border-purple-200"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed with instant search, real-time sync, and optimized performance.",
    badge: "Fast",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays secure with end-to-end encryption and local-first architecture.",
    badge: "Secure",
    color: "bg-green-100 text-green-700 border-green-200"
  },
  {
    icon: Cloud,
    title: "Offline Ready",
    description: "Work anywhere, anytime. Your notes sync seamlessly when you're back online.",
    badge: "Offline",
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find anything instantly with semantic search that understands context and meaning.",
    badge: "Smart",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200"
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Access your notes on any device - desktop, mobile, or tablet with native apps.",
    badge: "Multi-Device",
    color: "bg-pink-100 text-pink-700 border-pink-200"
  }
]

const additionalFeatures = [
  {
    icon: FileText,
    title: "Rich Text Editor",
    description: "Powerful markdown editor with live preview, syntax highlighting, and formatting tools."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share notes with your team, collaborate in real-time, and manage permissions easily."
  },
  {
    icon: Globe,
    title: "Web Clipper",
    description: "Save web pages, articles, and content directly to your notes with our browser extension."
  },
  {
    icon: Download,
    title: "Export Options",
    description: "Export your notes in multiple formats - PDF, Markdown, HTML, or plain text."
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary-100 text-primary-700 border-primary-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Features
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything you need for
            <span className="text-primary-600 block">productive note-taking</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to enhance your productivity and make note-taking effortless.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              And much more...
            </h3>
            <p className="text-lg text-gray-600">
              Discover additional features that make your note-taking experience even better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
