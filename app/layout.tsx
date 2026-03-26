import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'Guzzlr — Stop getting ripped off at the pump',
  description: 'Hyperpersonalised fuel intelligence for Australian drivers. Know when to fill, where to fill, and exactly how much you\'re spending.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#09090B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="bg-background text-text-primary font-body min-h-screen min-h-dvh antialiased">
        <main className="max-w-[430px] mx-auto pb-20 min-h-screen relative">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
