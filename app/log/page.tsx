'use client'

import { useState } from 'react'
import FillUpForm from '@/components/log/FillUpForm'
import FillHistory from '@/components/log/FillHistory'

export default function LogPage() {
  const [tab, setTab] = useState<'log' | 'history'>('log')

  return (
    <div className="px-4 pt-6 bg-surface min-h-screen">
      <h1 className="font-headline text-2xl font-bold text-on-surface mb-4">Fill-Up</h1>

      <div className="flex bg-surface-container-low rounded-xl p-0.5 mb-6">
        <button
          onClick={() => setTab('log')}
          className={`flex-1 py-2 rounded-lg text-sm font-headline font-bold tracking-widest uppercase transition-all ${
            tab === 'log' ? 'bg-primary text-white' : 'text-on-surface-variant'
          }`}
        >
          Log Fill-Up
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-2 rounded-lg text-sm font-headline font-bold tracking-widest uppercase transition-all ${
            tab === 'history' ? 'bg-primary text-white' : 'text-on-surface-variant'
          }`}
        >
          History
        </button>
      </div>

      {tab === 'log' ? <FillUpForm /> : <FillHistory />}
    </div>
  )
}
