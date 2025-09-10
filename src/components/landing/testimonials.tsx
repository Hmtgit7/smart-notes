'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "SC",
    content: "This app has completely transformed how I organize my thoughts. The AI suggestions are incredibly helpful and the offline-first approach means I never lose my work.",
    rating: 5,
    highlight: "Transformed my workflow"
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    company: "StartupXYZ",
    avatar: "MJ",
    content: "The markdown editor is fantastic and the real-time collaboration features have made team meetings so much more productive. Highly recommended!",
    rating: 5,
    highlight: "Perfect for teams"
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    company: "Creative Studio",
    avatar: "ER",
    content: "I love how intuitive the interface is. The web clipper saves me hours of work, and the export options are exactly what I need for my content workflow.",
    rating: 5,
    highlight: "Saves hours daily"
  },
  {
    name: "David Kim",
    role: "Research Scientist",
    company: "University Lab",
    avatar: "DK",
    content: "The semantic search is a game-changer. I can find any research note instantly, even from months ago. The privacy features give me peace of mind.",
    rating: 5,
    highlight: "Game-changing search"
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director",
    company: "GrowthCo",
    avatar: "LT",
    content: "Cross-platform sync works flawlessly. I can start a note on my phone during my commute and finish it on my laptop at work. Seamless experience.",
    rating: 5,
    highlight: "Flawless sync"
  },
  {
    name: "Alex Patel",
    role: "Freelance Writer",
    company: "Independent",
    avatar: "AP",
    content: "The AI enhancement features help me improve my writing quality. It's like having a personal editor that's always available. Worth every penny.",
    rating: 5,
    highlight: "Personal AI editor"
  }
]

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "1M+", label: "Notes Created" },
  { number: "99.9%", label: "Uptime" },
  { number: "4.9/5", label: "User Rating" }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
            <Star className="w-3 h-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Loved by thousands of
            <span className="text-emerald-600 block">productive professionals</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our users have to say about their experience with our note-taking platform.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-primary-200 mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 bg-primary-100 text-primary-700 font-semibold mr-4">
                      {testimonial.avatar}
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs bg-primary-50 text-primary-700">
                    {testimonial.highlight}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join thousands of satisfied users
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your journey with our note-taking platform and experience the difference for yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
