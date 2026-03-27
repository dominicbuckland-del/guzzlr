import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'Guzzlr',
  description: 'Stop getting ripped off at the pump.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text-primary min-h-screen antialiased">
        <main className="max-w-md mx-auto pb-24 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
