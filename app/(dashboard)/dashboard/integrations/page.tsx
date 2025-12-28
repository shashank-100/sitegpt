'use client'

import { useEffect, useState } from 'react'

interface Integration {
  id: string
  name: string
  provider: string
  type: string
  status: string
  lastSyncAt: string | null
  createdAt: string
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedType, setSelectedType] = useState<'data_source' | 'chat_platform'>('data_source')

  const dataSourceProviders = [
    { id: 'google_drive', name: 'Google Drive', icon: '📁', description: 'Sync training data from Google Drive' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦', description: 'Import files from Dropbox' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️', description: 'Access OneDrive documents' },
    { id: 'zendesk', name: 'Zendesk', icon: '💬', description: 'Import help center articles' },
    { id: 'notion', name: 'Notion', icon: '📝', description: 'Sync Notion pages' },
    { id: 'confluence', name: 'Confluence', icon: '🏢', description: 'Import Confluence pages' },
  ]

  const chatPlatformProviders = [
    { id: 'slack', name: 'Slack', icon: '💬', description: 'Answer questions in Slack' },
    { id: 'crisp', name: 'Crisp', icon: '💬', description: 'Integrate with Crisp chat' },
    { id: 'zendesk_chat', name: 'Zendesk Chat', icon: '🎫', description: 'Handle Zendesk tickets' },
    { id: 'intercom', name: 'Intercom', icon: '💬', description: 'Connect to Intercom' },
  ]

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Error fetching integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectIntegration = async (provider: string, type: string) => {
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          type,
          name: provider.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        }),
      })

      if (response.ok) {
        setShowAddModal(false)
        fetchIntegrations()
      }
    } catch (error) {
      console.error('Error connecting integration:', error)
    }
  }

  const disconnectIntegration = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return

    try {
      const response = await fetch(`/api/integrations?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchIntegrations()
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your favorite tools and platforms</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          + Add Integration
        </button>
      </div>

      {integrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No integrations yet</h2>
          <p className="text-gray-600 mb-6">
            Connect data sources and chat platforms to enhance your chatbot
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Add Your First Integration
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{integration.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  integration.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : integration.status === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Type: {integration.type === 'data_source' ? 'Data Source' : 'Chat Platform'}
              </p>
              {integration.lastSyncAt && (
                <p className="text-xs text-gray-500 mb-4">
                  Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => disconnectIntegration(integration.id)}
                  className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  Disconnect
                </button>
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add Integration</h2>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedType('data_source')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  selectedType === 'data_source'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Data Sources
              </button>
              <button
                onClick={() => setSelectedType('chat_platform')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  selectedType === 'chat_platform'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Chat Platforms
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {selectedType === 'data_source' && dataSourceProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => connectIntegration(provider.id, 'data_source')}
                  className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-primary-500 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{provider.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{provider.description}</p>
                    </div>
                  </div>
                </button>
              ))}

              {selectedType === 'chat_platform' && chatPlatformProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => connectIntegration(provider.id, 'chat_platform')}
                  className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-primary-500 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{provider.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{provider.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
