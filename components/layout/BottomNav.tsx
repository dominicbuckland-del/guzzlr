'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/map', label: 'Map', icon: MapIcon },
  { href: '/log', label: 'Log', icon: LogIcon },
  { href: '/rewards', label: 'Rewards', icon: RewardsIcon },
  { href: '/profile', label: 'Profile', icon: ProfileIcon },
]

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#00FF6A' : '#8B8B8B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#00FF6A' : '#8B8B8B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function LogIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#00FF6A' : '#8B8B8B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function RewardsIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#00FF6A' : '#8B8B8B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#00FF6A' : '#8B8B8B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()

  // Hide nav on onboarding
  if (pathname?.startsWith('/onboarding')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-surface-border">
      <div className="max-w-[430px] mx-auto flex items-center justify-around px-2 pb-safe">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname?.startsWith(href) || false
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-2 px-3 tap-active min-w-[56px]"
            >
              <Icon active={active} />
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-text-secondary'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
