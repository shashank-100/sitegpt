'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Chatbots', href: '/dashboard', icon: '🤖' },
    { name: 'Leads', href: '/dashboard/leads', icon: '👥' },
    { name: 'Integrations', href: '/dashboard/integrations', icon: '🔗' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold">
          SiteGPT
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
