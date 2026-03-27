'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home', icon: '\u2302' },
  { href: '/map', label: 'Map', icon: '\u25CE' },
  { href: '/log', label: 'Log', icon: '\uFF0B' },
  { href: '/rewards', label: 'Rewards', icon: '\u2605' },
  { href: '/profile', label: 'Profile', icon: '\u25CF' },
]

export default function BottomNav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/onboarding')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl" style={{ borderTop: '0.5px solid #d1d1d6' }}>
      <div className="max-w-md mx-auto flex items-center justify-around px-2 pb-safe pt-1.5">
        {tabs.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname?.startsWith(href) || false
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[52px]">
              <span className={`text-xl leading-none ${active ? 'text-tint' : 'text-text-muted'}`}>{icon}</span>
              <span className={`text-[10px] font-medium ${active ? 'text-tint' : 'text-text-muted'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
