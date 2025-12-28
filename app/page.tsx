import Link from 'next/link'

export default function Home() {
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
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/integrations" className="text-gray-600 hover:text-gray-900">
                Integrations
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Make AI your expert customer service agent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            It's like having ChatGPT specifically for your product. Instantly answer your visitors' questions
            with a personalized chatbot trained on your website content.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start a free trial
            </Link>
            <Link
              href="#demo"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Book a demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
            <span>✓ Personalized onboarding help</span>
            <span>✓ Friendly pricing as you scale</span>
            <span>✓ 95+ languages supported</span>
            <span>✓ 7-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        {/* Trusted By */}
        <div className="mt-20">
          <p className="text-center text-gray-600 mb-8">Trusted by these leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-2xl font-bold text-gray-400">GrowthX</div>
            <div className="text-2xl font-bold text-gray-400">Scope</div>
            <div className="text-2xl font-bold text-gray-400">Valant</div>
            <div className="text-2xl font-bold text-gray-400">Savory Institute</div>
            <div className="text-2xl font-bold text-gray-400">Sagacity</div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Imagine what you could do if you had an expert chatbot answering questions 24/7
          </h2>
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Before</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✗ Fickle, one-size-fits-all chatbots that do more harm than good</li>
                <li>✗ Generic GPT tools don't answer based on your training data</li>
                <li>✗ Custom-built bots are finicky and difficult to maintain</li>
                <li>✗ Customer service staff takes 3+ months to train</li>
                <li>✗ Bogged down with support tickets</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-green-600">After</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Provide 24/7/365 quality customer support with instant responses</li>
                <li>✓ Automate answering the vast majority of support tickets</li>
                <li>✓ Make your current support team twice as productive</li>
                <li>✓ Free up time to work on higher-level tasks</li>
                <li>✓ An automated resource that super charges your support team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
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
                Embed a chatbot on as many sites as you want — your marketing site, in-app, help center… wherever.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Learn and refine</h3>
              <p className="text-gray-600">
                Use real chat history to improve your chatbot by providing feedback that allows it to improve with every interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything you need to roll out your own AI chatbot
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Import Training Content"
              description="Enter a URL for SiteGPT to scan, or upload files, or drop raw text content directly."
            />
            <FeatureCard
              title="Q&A Training"
              description="Use real chat history to refine and improve your chatbot with feedback."
            />
            <FeatureCard
              title="GPT-4.1-mini & GPT-4.1"
              description="Choose between two powerful AI models. GPT-4.1-mini prioritizes speed while GPT-4.1 prioritizes depth."
            />
            <FeatureCard
              title="Embed on Sites"
              description="Embed a chatbot on as many sites as you want — your marketing site, in-app, help center."
            />
            <FeatureCard
              title="Customize Appearance"
              description="Personalize your chatbot to match your brand using custom logos and colors."
            />
            <FeatureCard
              title="Quick Prompts"
              description="Provide users with digital icebreakers to kick things off with common questions."
            />
            <FeatureCard
              title="Chat History"
              description="Review each conversation and assess the chatbot's performance."
            />
            <FeatureCard
              title="Escalate to Human"
              description="Users can seamlessly transition to a live agent at the push of a button."
            />
            <FeatureCard
              title="95+ Language Support"
              description="Your chatbot is ready to chat in 95 languages."
            />
            <FeatureCard
              title="Lead Generation"
              description="Capture interested visitors' details to build a list of potential leads."
            />
            <FeatureCard
              title="Functions"
              description="Automate tasks by interacting with your chatbot and other systems."
            />
            <FeatureCard
              title="Email Summaries"
              description="Keep a pulse on chatbot interactions with daily summaries delivered to your inbox."
            />
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
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#integrations">Integrations</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
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

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
