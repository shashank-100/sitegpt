'use client'

import { useEffect, useState } from 'react'

interface Analytics {
  totalConversations: number
  totalLeads: number
  totalAppointments: number
  conversionRate: number
  avgResponseTime: number
  avgLeadScore: number
  leadsByStatus: Record<string, number>
  leadsByDay: Array<{ date: string; count: number }>
  appointmentsByDay: Array<{ date: string; count: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll use mock data
      setAnalytics({
        totalConversations: 1247,
        totalLeads: 342,
        totalAppointments: 89,
        conversionRate: 27.4,
        avgResponseTime: 5.2,
        avgLeadScore: 64,
        leadsByStatus: {
          new: 45,
          qualified: 123,
          contacted: 87,
          converted: 67,
          lost: 20,
        },
        leadsByDay: [
          { date: '2025-01-21', count: 12 },
          { date: '2025-01-22', count: 18 },
          { date: '2025-01-23', count: 15 },
          { date: '2025-01-24', count: 23 },
          { date: '2025-01-25', count: 19 },
          { date: '2025-01-26', count: 21 },
          { date: '2025-01-27', count: 16 },
        ],
        appointmentsByDay: [
          { date: '2025-01-21', count: 3 },
          { date: '2025-01-22', count: 5 },
          { date: '2025-01-23', count: 4 },
          { date: '2025-01-24', count: 7 },
          { date: '2025-01-25', count: 6 },
          { date: '2025-01-26', count: 5 },
          { date: '2025-01-27', count: 4 },
        ],
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track performance and conversion metrics</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Conversations</div>
            <div className="text-2xl">💬</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalConversations.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-2">↑ 12% from last period</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Leads Generated</div>
            <div className="text-2xl">👥</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalLeads.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-2">↑ 18% from last period</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Appointments Booked</div>
            <div className="text-2xl">📅</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalAppointments.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-2">↑ 24% from last period</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="text-2xl">📈</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.conversionRate}%</div>
          <div className="text-sm text-green-600 mt-2">↑ 3.2% from last period</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Response Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="font-bold text-green-600">{analytics.avgResponseTime}s</span>
              </div>
              <div className="text-xs text-gray-500">
                78% more likely to convert with 5-second response
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Avg Lead Score</span>
                <span className="font-bold text-gray-900">{analytics.avgLeadScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${analytics.avgLeadScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Lead Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(analytics.leadsByStatus).map(([status, count]) => {
              const total = Object.values(analytics.leadsByStatus).reduce((a, b) => a + b, 0)
              const percentage = ((count / total) * 100).toFixed(1)
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{status}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'converted' ? 'bg-green-500' :
                        status === 'qualified' ? 'bg-yellow-500' :
                        status === 'contacted' ? 'bg-purple-500' :
                        status === 'lost' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leads by Day</h3>
          <div className="space-y-2">
            {analytics.leadsByDay.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className="text-sm text-gray-600 w-24">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-primary-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(day.count / Math.max(...analytics.leadsByDay.map(d => d.count))) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{day.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Appointments by Day</h3>
          <div className="space-y-2">
            {analytics.appointmentsByDay.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className="text-sm text-gray-600 w-24">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-green-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(day.count / Math.max(...analytics.appointmentsByDay.map(d => d.count))) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{day.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Key Insights</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Your chatbot responds {analytics.avgResponseTime}x faster than email - this gives you a huge competitive advantage!</li>
          <li>• Conversion rate is {analytics.conversionRate}% - above industry average of 22%</li>
          <li>• {analytics.leadsByStatus.qualified + analytics.leadsByStatus.contacted} qualified leads ready for follow-up</li>
          <li>• Peak conversion days are Tuesday and Thursday - consider targeting ads on these days</li>
        </ul>
      </div>
    </div>
  )
}
