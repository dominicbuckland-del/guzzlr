'use client'

import { useEffect, useState } from 'react'
import { generatePriceTrend } from '@/lib/cycle-engine'
import { useGuzzlrStore } from '@/lib/store'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

export default function PriceTrendChart() {
  const { car } = useGuzzlrStore()
  const [data, setData] = useState<{ date: string; price: number }[]>([])
  useEffect(() => { setData(generatePriceTrend('brisbane', car?.fuelType || 'Diesel', 30)) }, [car])
  if (!data.length) return null

  return (
    <div className="card p-4">
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">30-Day Trend</p>
          <p className="font-semibold text-[15px] mt-0.5">{car?.fuelType || 'Diesel'} · Brisbane</p>
        </div>
        <div className="text-right">
          <p className="text-text-muted text-[11px]">Today</p>
          <p className="price-ticker text-[17px]">{data[data.length-1]?.price.toFixed(1)}</p>
        </div>
      </div>
      <div className="h-[150px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#007AFF" stopOpacity={0.1}/><stop offset="100%" stopColor="#007AFF" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="date" tickFormatter={d => new Date(d).getDate().toString()} tick={{ fill: '#aeaeb2', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#aeaeb2', fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} width={32} tickFormatter={v => v.toFixed(0)} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', fontSize: '12px' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${Number(value).toFixed(1)}c/L`, 'Price']}
              labelFormatter={l => new Date(l).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} />
            <Area type="monotone" dataKey="price" stroke="#007AFF" strokeWidth={1.5} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
