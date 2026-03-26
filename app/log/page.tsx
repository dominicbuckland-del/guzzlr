'use client'

import { useState } from 'react'
import FillUpForm from '@/components/log/FillUpForm'
import FillHistory from '@/components/log/FillHistory'

export default function LogPage() {
  const [tab, setTab] = useState<'log' | 'history'>('log')

  return (
    <div className="px-4 pt-6">
      <h1 className="font-heading text-2xl font-bold mb-4">Fill-Up</h1>

      <div className="flex bg-surface rounded-lg p-0.5 mb-6">
        <button
          onClick={() => setTab('log')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'log' ? 'bg-primary text-background' : 'text-text-secondary'
          }`}
        >
          Log Fill-Up
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'history' ? 'bg-primary text-background' : 'text-text-secondary'
          }`}
        >
          History
        </button>
      </div>

      {tab === 'log' ? <FillUpForm /> : <FillHistory />}
    </div>
  )
}
