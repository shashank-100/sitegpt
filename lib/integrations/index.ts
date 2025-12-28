import { IntegrationConfig, IntegrationCredentials, BaseIntegration } from './base'
import { ZendeskIntegration } from './zendesk'
import { SlackIntegration } from './slack'

export type IntegrationProvider =
  | 'google_drive'
  | 'dropbox'
  | 'onedrive'
  | 'sharepoint'
  | 'zendesk'
  | 'gitbook'
  | 'box'
  | 'notion'
  | 'freshdesk'
  | 'confluence'
  | 'intercom'
  | 'youtube'
  | 'slack'
  | 'crisp'
  | 'zendesk_chat'
  | 'messenger'
  | 'google_chat'
  | 'freshchat'
  | 'zoho_salesiq'

export function createIntegration(
  provider: IntegrationProvider,
  config: IntegrationConfig,
  credentials: IntegrationCredentials
): BaseIntegration | null {
  switch (provider) {
    case 'zendesk':
      return new ZendeskIntegration(config, credentials)
    case 'slack':
      return new SlackIntegration(config, credentials)
    // Add more integrations as they are implemented
    default:
      console.warn(`Integration provider "${provider}" not implemented yet`)
      return null
  }
}

export { BaseIntegration, IntegrationConfig, IntegrationCredentials }
export { ZendeskIntegration } from './zendesk'
export { SlackIntegration } from './slack'
