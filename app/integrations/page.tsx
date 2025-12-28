import Link from 'next/link'

export default function IntegrationsPage() {
  const dataSourceIntegrations = [
    { name: 'Google Drive', icon: '📁', description: 'Seamlessly access and sync chatbot training data stored in Google Drive', available: true },
    { name: 'Dropbox', icon: '📦', description: 'Integrate with Dropbox to utilize stored documents and files for chatbot training', available: true },
    { name: 'OneDrive', icon: '☁️', description: 'Leverage OneDrive for cloud-based storage of chatbot training materials', available: true },
    { name: 'SharePoint', icon: '🔷', description: 'Utilize SharePoint to organize and share chatbot training documents', available: true },
    { name: 'Zendesk', icon: '💬', description: 'Access Zendesk help center content for rich chatbot training data', available: true },
    { name: 'Gitbook', icon: '📚', description: 'Connect with Gitbook to access structured documentation and knowledge bases', available: true },
    { name: 'Box', icon: '📦', description: 'Incorporate Box for secure cloud storage of training data', available: true },
    { name: 'Notion', icon: '📝', description: 'Link with Notion to harness extensive notes and organized data', available: true },
    { name: 'Freshdesk', icon: '🎫', description: 'Access Freshdesk help center articles for chatbot training', available: true },
    { name: 'Confluence', icon: '🏢', description: 'Use Confluence as a source of comprehensive documentation', available: true },
    { name: 'Intercom', icon: '💬', description: 'Leverage Intercom help center articles for chatbot knowledge', available: true },
    { name: 'YouTube', icon: '▶️', description: 'Train your chatbot using YouTube videos, playlists, and channels', available: true },
  ]

  const chatIntegrations = [
    { name: 'Google Chat', icon: '💬', description: 'Provide instant support directly in Google Chat', available: true },
    { name: 'Messenger', icon: '💬', description: 'Handle customer queries in real-time on Facebook Messenger', available: true },
    { name: 'Crisp', icon: '💬', description: 'Automatically answer common customer queries through Crisp', available: true },
    { name: 'Slack', icon: '💬', description: 'Facilitate internal communications or customer service through Slack', available: true },
    { name: 'Freshchat', icon: '💬', description: 'Interact with customers and resolve common issues', available: true },
    { name: 'Zendesk', icon: '🎫', description: 'Improve ticket response times and enhance customer satisfaction', available: true },
    { name: 'Zoho SalesIQ', icon: '💬', description: 'Engage with visitors in real-time and convert leads', available: true },
    { name: 'WhatsApp', icon: '📱', description: 'Offer intelligent responses directly in WhatsApp', available: false, comingSoon: true },
    { name: 'Intercom', icon: '💬', description: 'Chat with users and resolve common issues', available: false, comingSoon: true },
    { name: 'Hubspot', icon: '🔶', description: 'Chat with users through HubSpot', available: false, comingSoon: true },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                SiteGPT
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/integrations" className="text-gray-600 hover:text-gray-900">
                Integrations
              </Link>
              <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Integrations
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Direct integrations with your favorite tools. Let SiteGPT answer support questions over your customers' communication channels of choice.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
            <span>✓ Personalized onboarding help</span>
            <span>✓ Friendly pricing as you scale</span>
            <span>✓ 95+ languages supported</span>
            <span>✓ 7-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start a free trial
            </Link>
            <Link
              href="#demo"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Data Source Integrations */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Source Integrations</h2>
            <p className="text-lg text-gray-600">
              Enhance your chatbot with diverse data sources
            </p>
            <p className="text-gray-500 mt-2">
              Integrate a wide range of data sources to empower SiteGPT with rich, varied, and up-to-date training material
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dataSourceIntegrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{integration.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="#request"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Looking for another integration? Submit a request →
            </Link>
          </div>
        </div>
      </section>

      {/* Chat Integrations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chat Integrations</h2>
            <p className="text-lg text-gray-600">
              24/7 support in the platform channels you already use
            </p>
            <p className="text-gray-500 mt-2">
              Leverage SiteGPT as a standalone support chatbot or as a support agent inside your existing support channels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chatIntegrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 relative"
              >
                {integration.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{integration.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="#request"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Looking for another integration? Submit a request →
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            You're three easy steps away from your own personalized AI support chatbot
          </h2>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sync training data</h3>
              <p className="text-gray-600">
                Enter your URL for SiteGPT to scan, or upload files, or drop in raw text content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Install on your site</h3>
              <p className="text-gray-600">
                Embed a chatbot on as many sites as you want — your marketing site, in-app, help center.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Learn and refine</h3>
              <p className="text-gray-600">
                Use real chat history to improve your chatbot by providing feedback that allows it to improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Customer testimonials</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-gray-700 mb-6 italic">
              "We've got the bot dialled in - we're using GPT-4, have an avenue for escalations to Zendesk, and so far I have no complaints."
            </p>
            <div className="text-gray-900 font-semibold">Brent Burrows II</div>
            <div className="text-gray-600">Vice President – Retail & Sales at CBS Bahamas</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to take SiteGPT for a spin?
          </h2>
          <p className="text-xl mb-8">
            Find out if a personalized AI support chatbot is a good fit for you in just a few hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start a free trial
            </Link>
            <Link
              href="#demo"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/#features">Features</Link></li>
                <li><Link href="/integrations">Integrations</Link></li>
                <li><Link href="/#pricing">Pricing</Link></li>
                <li><Link href="#api">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#terms">Terms & Conditions</Link></li>
                <li><Link href="#privacy">Privacy</Link></li>
                <li><Link href="#refund">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>support@sitegpt.ai</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">SiteGPT</h3>
              <p className="text-sm">
                Instantly answer your visitors' questions with a personalized chatbot trained on your website content.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>© SiteGPT 2025. All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
