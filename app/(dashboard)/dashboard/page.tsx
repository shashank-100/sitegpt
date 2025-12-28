'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Chatbot {
  id: string
  name: string
  description: string | null
  createdAt: string
  _count: {
    conversations: number
    trainingData: number
  }
}

export default function DashboardPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newChatbotName, setNewChatbotName] = useState('')
  const [newChatbotDescription, setNewChatbotDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchChatbots()
  }, [])

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots')
      const data = await response.json()
      setChatbots(data.chatbots)
    } catch (error) {
      console.error('Error fetching chatbots:', error)
    } finally {
      setLoading(false)
    }
  }

  const createChatbot = async () => {
    if (!newChatbotName.trim()) return

    setCreating(true)
    try {
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newChatbotName,
          description: newChatbotDescription,
        }),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setNewChatbotName('')
        setNewChatbotDescription('')
        fetchChatbots()
      }
    } catch (error) {
      console.error('Error creating chatbot:', error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Chatbots</h1>
          <p className="text-gray-600 mt-1">Manage and configure your AI chatbots</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          + Create Chatbot
        </button>
      </div>

      {chatbots.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No chatbots yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first chatbot to get started with AI-powered customer support
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Create Your First Chatbot
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <Link
              key={chatbot.id}
              href={`/dashboard/chatbots/${chatbot.id}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{chatbot.name}</h3>
              {chatbot.description && (
                <p className="text-gray-600 mb-4">{chatbot.description}</p>
              )}
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{chatbot._count.conversations} conversations</span>
                <span>{chatbot._count.trainingData} training sources</span>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Created {formatDate(chatbot.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Chatbot</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chatbot Name
                </label>
                <input
                  type="text"
                  value={newChatbotName}
                  onChange={(e) => setNewChatbotName(e.target.value)}
                  placeholder="e.g., Customer Support Bot"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newChatbotDescription}
                  onChange={(e) => setNewChatbotDescription(e.target.value)}
                  placeholder="Describe what this chatbot will help with..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewChatbotName('')
                  setNewChatbotDescription('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createChatbot}
                disabled={creating || !newChatbotName.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
