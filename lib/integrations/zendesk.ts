import axios from 'axios'
import { BaseIntegration, IntegrationConfig, IntegrationCredentials, DataSourceIntegration } from './base'

export class ZendeskIntegration extends BaseIntegration implements DataSourceIntegration {
  private subdomain: string
  private email: string
  private apiToken: string

  constructor(config: IntegrationConfig, credentials: IntegrationCredentials) {
    super(config, credentials)
    this.subdomain = credentials.subdomain || ''
    this.email = credentials.email || ''
    this.apiToken = credentials.apiToken || ''
  }

  async connect(): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://${this.subdomain}.zendesk.com/api/v2/help_center/articles.json`,
        {
          auth: {
            username: `${this.email}/token`,
            password: this.apiToken,
          },
          params: {
            per_page: 1,
          },
        }
      )
      return response.status === 200
    } catch (error) {
      console.error('Zendesk connection error:', error)
      return false
    }
  }

  async disconnect(): Promise<boolean> {
    // Zendesk doesn't require explicit disconnection
    return true
  }

  async sync(): Promise<any> {
    const documents = await this.fetchDocuments()
    return {
      documentsCount: documents.length,
      lastSyncAt: new Date(),
    }
  }

  async getStatus(): Promise<'active' | 'inactive' | 'error'> {
    const isConnected = await this.connect()
    return isConnected ? 'active' : 'error'
  }

  async fetchDocuments(): Promise<Array<{ title: string; content: string; url?: string }>> {
    try {
      const articles: Array<{ title: string; content: string; url?: string }> = []
      let page = 1
      let hasMore = true

      while (hasMore && page <= 10) { // Limit to 10 pages
        const response = await axios.get(
          `https://${this.subdomain}.zendesk.com/api/v2/help_center/articles.json`,
          {
            auth: {
              username: `${this.email}/token`,
              password: this.apiToken,
            },
            params: {
              per_page: 100,
              page,
            },
          }
        )

        const data = response.data

        for (const article of data.articles) {
          articles.push({
            title: article.title,
            content: article.body || '',
            url: article.html_url,
          })
        }

        hasMore = data.next_page !== null
        page++
      }

      return articles
    } catch (error) {
      console.error('Error fetching Zendesk articles:', error)
      return []
    }
  }

  async importToTrainingData(chatbotId: string): Promise<void> {
    // This would be implemented to save documents to the training_data table
    // For now, it's a placeholder
    const documents = await this.fetchDocuments()
    console.log(`Would import ${documents.length} documents to chatbot ${chatbotId}`)
  }
}
