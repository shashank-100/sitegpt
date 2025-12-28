export interface IntegrationConfig {
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  refreshToken?: string
  webhookUrl?: string
  [key: string]: any
}

export interface IntegrationCredentials {
  [key: string]: any
}

export abstract class BaseIntegration {
  protected config: IntegrationConfig
  protected credentials: IntegrationCredentials

  constructor(config: IntegrationConfig, credentials: IntegrationCredentials) {
    this.config = config
    this.credentials = credentials
  }

  abstract connect(): Promise<boolean>
  abstract disconnect(): Promise<boolean>
  abstract sync(): Promise<any>
  abstract getStatus(): Promise<'active' | 'inactive' | 'error'>
}

export interface DataSourceIntegration extends BaseIntegration {
  fetchDocuments(): Promise<Array<{ title: string; content: string; url?: string }>>
  importToTrainingData(chatbotId: string): Promise<void>
}

export interface ChatPlatformIntegration extends BaseIntegration {
  sendMessage(recipientId: string, message: string): Promise<boolean>
  receiveMessage(messageId: string): Promise<{ senderId: string; content: string }>
  setupWebhook(url: string): Promise<boolean>
}
