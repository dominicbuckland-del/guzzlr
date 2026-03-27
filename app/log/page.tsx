'use client'

import { useState } from 'react'
import FillUpForm from '@/components/log/FillUpForm'
import FillHistory from '@/components/log/FillHistory'

export default function LogPage() {
  const [tab, setTab] = useState<'log' | 'history'>('log')

  return (
    <div className="px-4 pt-8 bg-bg min-h-screen">
      <h1 className="font-display text-[22px] font-bold text-text-primary mb-4">Fill-Up</h1>
      <div className="flex bg-surface rounded-[10px] p-[3px] mb-5">
        {(['log', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold capitalize transition-colors ${tab === t ? 'bg-text-primary text-white' : 'text-text-secondary'}`}>{t === 'log' ? 'Log Fill-Up' : 'History'}</button>
        ))}
      </div>
      {tab === 'log' ? <FillUpForm /> : <FillHistory />}
    </div>
  )
}
