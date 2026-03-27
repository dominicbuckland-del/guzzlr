'use client'

import { useEffect, useState } from 'react'
import { generatePriceTrend } from '@/lib/cycle-engine'
import { useGuzzlrStore } from '@/lib/store'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

export default function PriceTrendChart() {
  const { car } = useGuzzlrStore()
  const [data, setData] = useState<{ date: string; price: number }[]>([])

  useEffect(() => {
    setData(generatePriceTrend('brisbane', car?.fuelType || 'Diesel', 30))
  }, [car])

  if (!data.length) return null

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold">30-Day Trend</p>
          <p className="font-headline font-bold text-sm mt-0.5">{car?.fuelType || 'Diesel'}</p>
        </div>
        <p className="price-ticker text-lg">{data[data.length - 1]?.price.toFixed(1)}<span className="text-text-muted text-xs ml-1">c/L</span></p>
      </div>
      <div className="h-[160px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickFormatter={d => new Date(d).getDate().toString()} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} width={35} tickFormatter={v => v.toFixed(0)} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${Number(value).toFixed(1)}c/L`, 'Price']}
              labelFormatter={l => new Date(l).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            />
            <Area type="monotone" dataKey="price" stroke="#fff" strokeWidth={1.5} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
