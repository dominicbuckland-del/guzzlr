'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/map', label: 'Map', icon: '◎' },
  { href: '/log', label: 'Log', icon: '+' },
  { href: '/rewards', label: 'Rewards', icon: '★' },
  { href: '/profile', label: 'Profile', icon: '●' },
]

export default function BottomNav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/onboarding')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-t border-surface-border">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 pb-safe pt-2">
        {tabs.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname?.startsWith(href) || false
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 tap-active transition-colors ${
                active ? 'text-white' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className={`text-lg ${active ? 'text-white' : ''}`}>{icon}</span>
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
