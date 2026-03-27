'use client'

import { useState } from 'react'
import FillUpForm from '@/components/log/FillUpForm'
import FillHistory from '@/components/log/FillHistory'

export default function LogPage() {
  const [tab, setTab] = useState<'log' | 'history'>('log')

  return (
    <div className="px-4 pt-8">
      <h1 className="font-headline text-2xl font-extrabold mb-4">Fill-Up</h1>
      <div className="flex bg-surface border border-surface-border rounded-lg p-0.5 mb-5">
        {(['log', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-md text-sm font-bold capitalize transition-colors ${tab === t ? 'bg-white text-black' : 'text-text-muted'}`}>{t === 'log' ? 'Log Fill-Up' : 'History'}</button>
        ))}
      </div>
      {tab === 'log' ? <FillUpForm /> : <FillHistory />}
    </div>
  )
}
