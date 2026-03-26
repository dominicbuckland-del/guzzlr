import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'Guzzlr — Stop getting ripped off at the pump',
  description: 'Hyperpersonalised fuel intelligence for Australian drivers.',
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
  themeColor: '#f9f6f5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-surface">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-body min-h-screen min-h-dvh antialiased">
        <main className="max-w-md mx-auto pb-24 min-h-screen relative">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
