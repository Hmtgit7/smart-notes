'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  PenTool, 
  Brain, 
  Share2, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: "01",
    icon: PenTool,
    title: "Create & Write",
    description: "Start writing your notes with our intuitive markdown editor. Use rich formatting, tables, and code blocks.",
    features: ["Rich text editor", "Markdown support", "Auto-save", "Offline access"],
    color: "from-blue-500 to-blue-600"
  },
  {
    number: "02", 
    icon: Brain,
    title: "AI Enhancement",
    description: "Let our AI analyze your content and provide intelligent suggestions, improvements, and insights.",
    features: ["Smart suggestions", "Content enhancement", "Grammar check", "Style improvements"],
    color: "from-purple-500 to-purple-600"
  },
  {
    number: "03",
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share your notes with team members, collaborate in real-time, and manage permissions easily.",
    features: ["Real-time collaboration", "Permission management", "Version history", "Comments"],
    color: "from-emerald-500 to-emerald-600"
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
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
            <Sparkles className="w-3 h-3 mr-1" />
            How it works
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get started in
            <span className="text-emerald-600 block">three simple steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is designed to be intuitive and powerful. Here's how you can transform your note-taking experience.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mr-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Step {step.number}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {step.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <div className="space-y-6">
                    {/* Mock content based on step */}
                    {step.number === "01" && (
                      <>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">New Note</h4>
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="bg-primary-50 p-4 rounded-lg">
                          <div className="text-sm text-primary-700">
                            💡 Tip: Use **bold** and *italic* for emphasis
                          </div>
                        </div>
                      </>
                    )}

                    {step.number === "02" && (
                      <>
                        <div className="flex items-center space-x-2 mb-4">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                          <span className="font-semibold text-gray-900">AI Suggestions</span>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm text-purple-700 font-medium mb-1">
                              ✨ Content Enhancement
                            </div>
                            <div className="text-sm text-gray-600">
                              Consider adding more specific examples to strengthen your argument.
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm text-blue-700 font-medium mb-1">
                              📝 Grammar Check
                            </div>
                            <div className="text-sm text-gray-600">
                              "Their" should be "There" in line 3.
                            </div>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-lg">
                            <div className="text-sm text-emerald-700 font-medium mb-1">
                              🎯 Style Suggestion
                            </div>
                            <div className="text-sm text-gray-600">
                              This paragraph could benefit from a transition sentence.
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {step.number === "03" && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Team Collaboration</h4>
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              A
                            </div>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              B
                            </div>
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              C
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">Alice Johnson</span>
                              <span className="text-xs text-gray-500">2 min ago</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Great points! I've added some additional research data.
                            </div>
                          </div>
                          <div className="bg-primary-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">Bob Smith</span>
                              <span className="text-xs text-primary-600">Editing now</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Working on the conclusion section...
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                            Share
                          </button>
                          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium">
                            Export
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already transformed their note-taking workflow.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
