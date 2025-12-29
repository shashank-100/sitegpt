'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { generateEmbedCode } from '@/lib/utils'

interface Chatbot {
  id: string
  name: string
  description: string | null
  model: string
  welcomeMessage: string
  theme: any
  quickPrompts: any
  trainingData: TrainingData[]
  _count: {
    conversations: number
  }
}

interface TrainingData {
  id: string
  type: string
  source: string
  content: string
  createdAt: string
}

export default function ChatbotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chatbotId = params.id as string

  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'training' | 'customize' | 'booking' | 'qualification' | 'embed' | 'history'>('training')

  // Training data states
  const [showAddTraining, setShowAddTraining] = useState(false)
  const [trainingType, setTrainingType] = useState<'url' | 'text'>('url')
  const [trainingUrl, setTrainingUrl] = useState('')
  const [trainingText, setTrainingText] = useState('')
  const [addingTraining, setAddingTraining] = useState(false)

  // Customization states
  const [editMode, setEditMode] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedWelcome, setEditedWelcome] = useState('')
  const [editedModel, setEditedModel] = useState('gpt-4.1-mini')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchChatbot()
  }, [chatbotId])

  const fetchChatbot = async () => {
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`)
      const data = await response.json()
      setChatbot(data.chatbot)
      setEditedName(data.chatbot.name)
      setEditedWelcome(data.chatbot.welcomeMessage)
      setEditedModel(data.chatbot.model)
    } catch (error) {
      console.error('Error fetching chatbot:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTrainingData = async () => {
    if (trainingType === 'url' && !trainingUrl.trim()) return
    if (trainingType === 'text' && !trainingText.trim()) return

    setAddingTraining(true)
    try {
      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          type: trainingType,
          source: trainingType === 'url' ? trainingUrl : '',
          content: trainingType === 'text' ? trainingText : '',
        }),
      })

      if (response.ok) {
        setShowAddTraining(false)
        setTrainingUrl('')
        setTrainingText('')
        fetchChatbot()
      }
    } catch (error) {
      console.error('Error adding training data:', error)
    } finally {
      setAddingTraining(false)
    }
  }

  const deleteTrainingData = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training data?')) return

    try {
      const response = await fetch(`/api/training?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchChatbot()
      }
    } catch (error) {
      console.error('Error deleting training data:', error)
    }
  }

  const saveChatbot = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          welcomeMessage: editedWelcome,
          model: editedModel,
        }),
      })

      if (response.ok) {
        setEditMode(false)
        fetchChatbot()
      }
    } catch (error) {
      console.error('Error saving chatbot:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteChatbot = async () => {
    if (!confirm('Are you sure you want to delete this chatbot? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error deleting chatbot:', error)
    }
  }

  if (loading || !chatbot) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  const embedCode = generateEmbedCode(chatbot.id, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{chatbot.name}</h1>
            {chatbot.description && (
              <p className="text-gray-600 mt-1">{chatbot.description}</p>
            )}
          </div>
          <button
            onClick={deleteChatbot}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Delete Chatbot
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'training', label: 'Training Data' },
            { id: 'customize', label: 'Customize' },
            { id: 'booking', label: 'Booking' },
            { id: 'qualification', label: 'Qualification' },
            { id: 'embed', label: 'Embed Code' },
            { id: 'history', label: 'Chat History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Training Data Tab */}
      {activeTab === 'training' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Training Data</h2>
            <button
              onClick={() => setShowAddTraining(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              + Add Training Data
            </button>
          </div>

          <div className="space-y-4">
            {chatbot.trainingData.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No training data yet. Add some to get started!</p>
              </div>
            ) : (
              chatbot.trainingData.map((data) => (
                <div key={data.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                          {data.type}
                        </span>
                        {data.source && (
                          <span className="text-sm text-gray-600">{data.source}</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-3">{data.content.substring(0, 200)}...</p>
                    </div>
                    <button
                      onClick={() => deleteTrainingData(data.id)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Training Modal */}
          {showAddTraining && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-4">Add Training Data</h2>

                <div className="mb-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTrainingType('url')}
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        trainingType === 'url'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      From URL
                    </button>
                    <button
                      onClick={() => setTrainingType('text')}
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        trainingType === 'text'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Raw Text
                    </button>
                  </div>
                </div>

                {trainingType === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={trainingUrl}
                      onChange={(e) => setTrainingUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {trainingType === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Content
                    </label>
                    <textarea
                      value={trainingText}
                      onChange={(e) => setTrainingText(e.target.value)}
                      placeholder="Paste your training content here..."
                      rows={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddTraining(false)
                      setTrainingUrl('')
                      setTrainingText('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTrainingData}
                    disabled={addingTraining}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {addingTraining ? 'Adding...' : 'Add Training Data'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customize Tab */}
      {activeTab === 'customize' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chatbot Name
              </label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Welcome Message
              </label>
              <textarea
                value={editedWelcome}
                onChange={(e) => setEditedWelcome(e.target.value)}
                disabled={!editMode}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Model
              </label>
              <select
                value={editedModel}
                onChange={(e) => setEditedModel(e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
              >
                <option value="gpt-4.1-mini">GPT-4.1-mini (Fast)</option>
                <option value="gpt-4.1">GPT-4.1 (Accurate)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Edit Settings
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setEditedName(chatbot.name)
                      setEditedWelcome(chatbot.welcomeMessage)
                      setEditedModel(chatbot.model)
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChatbot}
                    disabled={saving}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Tab */}
      {activeTab === 'booking' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold mb-4">Appointment Booking Settings</h3>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Enable Appointment Booking</div>
                <div className="text-sm text-gray-600 mt-1">
                  Allow visitors to book appointments directly through the chatbot
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={chatbot.enableBooking || false}
                  onChange={async (e) => {
                    await fetch(`/api/chatbots/${chatbotId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ enableBooking: e.target.checked }),
                    })
                    fetchChatbot()
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar Integration
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="">No calendar integration</option>
                <option value="google_calendar">Google Calendar</option>
                <option value="calendly">Calendly</option>
                <option value="cal_com">Cal.com</option>
                <option value="outlook">Outlook Calendar</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Connect your calendar to automatically manage availability
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
              <p className="text-sm text-gray-600">
                Default: Monday - Friday, 9:00 AM - 5:00 PM (30-minute slots)
              </p>
              <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
                Customize Business Hours →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Qualification Tab */}
      {activeTab === 'qualification' && (
        <div className="max-w-3xl">
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Lead Qualification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ask questions to qualify leads and calculate lead scores
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={chatbot.enableQualification || false}
                  onChange={async (e) => {
                    await fetch(`/api/chatbots/${chatbotId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ enableQualification: e.target.checked }),
                    })
                    fetchChatbot()
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Use Industry Templates</h4>
              <p className="text-sm text-blue-800 mb-3">
                Get started quickly with pre-built qualification questions for your industry
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50">
                  Legal Services
                </button>
                <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50">
                  Healthcare
                </button>
                <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50">
                  Home Services
                </button>
                <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50">
                  Financial
                </button>
                <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50">
                  Real Estate
                </button>
                <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50">
                  B2B Services
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Qualification Questions</h4>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                  + Add Question
                </button>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">What's your budget range?</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Type: Multiple choice • Score: 20 points
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">When do you need this completed?</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Type: Multiple choice • Score: 25 points
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                  </div>
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  Add qualification questions to score leads automatically
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Lead Scoring</h4>
              <p className="text-sm text-gray-600">
                Leads are scored 0-100 based on their answers. Leads with 70+ points are marked as "Hot Leads" 🔥
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• 70-100: Hot Lead (high priority follow-up)</li>
                <li>• 50-69: Qualified (good potential)</li>
                <li>• 0-49: New Lead (needs nurturing)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Tab */}
      {activeTab === 'embed' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Embed Code</h3>
            <p className="text-gray-600 mb-4">
              Copy and paste this code into your website to embed the chatbot:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{embedCode}</pre>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode)
                alert('Embed code copied to clipboard!')
              }}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Chat History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              Chat history will appear here. Total conversations: {chatbot._count.conversations}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
