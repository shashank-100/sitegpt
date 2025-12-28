import axios from 'axios'
import { BaseIntegration, IntegrationConfig, IntegrationCredentials, ChatPlatformIntegration } from './base'

export class SlackIntegration extends BaseIntegration implements ChatPlatformIntegration {
  private botToken: string

  constructor(config: IntegrationConfig, credentials: IntegrationCredentials) {
    super(config, credentials)
    this.botToken = credentials.botToken || ''
  }

  async connect(): Promise<boolean> {
    try {
      const response = await axios.post(
        'https://slack.com/api/auth.test',
        {},
        {
          headers: {
            Authorization: `Bearer ${this.botToken}`,
          },
        }
      )
      return response.data.ok
    } catch (error) {
      console.error('Slack connection error:', error)
      return false
    }
  }

  async disconnect(): Promise<boolean> {
    // Slack doesn't require explicit disconnection
    return true
  }

  async sync(): Promise<any> {
    return {
      lastSyncAt: new Date(),
    }
  }

  async getStatus(): Promise<'active' | 'inactive' | 'error'> {
    const isConnected = await this.connect()
    return isConnected ? 'active' : 'error'
  }

  async sendMessage(channelId: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        'https://slack.com/api/chat.postMessage',
        {
          channel: channelId,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${this.botToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data.ok
    } catch (error) {
      console.error('Error sending Slack message:', error)
      return false
    }
  }

  async receiveMessage(messageId: string): Promise<{ senderId: string; content: string }> {
    // This would typically be handled via webhooks
    // Placeholder implementation
    return {
      senderId: '',
      content: '',
    }
  }

  async setupWebhook(url: string): Promise<boolean> {
    // This would configure Slack to send events to the provided URL
    // In practice, this is done through the Slack app configuration
    console.log(`Webhook URL configured: ${url}`)
    return true
  }
}
