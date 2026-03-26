'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/map', label: 'Map', icon: 'distance' },
  { href: '/rewards', label: 'Rewards', icon: 'redeem' },
  { href: '/profile', label: 'Profile', icon: 'account_circle' },
]

export default function BottomNav() {
  const pathname = usePathname()

  if (pathname?.startsWith('/onboarding')) return null

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-4 pb-6 pt-2 bg-[#f9f6f5]/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-10px_40px_rgba(47,47,46,0.06)]">
      {tabs.map(({ href, label, icon }) => {
        const active = href === '/' ? pathname === '/' : pathname?.startsWith(href) || false
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              active
                ? 'bg-primary-container text-white rounded-full p-3 scale-110 -translate-y-2 shadow-lg'
                : 'text-on-surface p-2 opacity-60 hover:opacity-100 active:scale-110'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${active ? 'mb-0.5' : 'mb-1'}`}
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="font-body text-[10px] font-bold uppercase tracking-widest">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
