'use client'

import { useEffect, useState } from 'react'
import { generatePriceTrend } from '@/lib/cycle-engine'
import { useGuzzlrStore } from '@/lib/store'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts'

export default function PriceTrendChart() {
  const { car } = useGuzzlrStore()
  const [data, setData] = useState<{ date: string; price: number; phase: string }[]>([])

  useEffect(() => {
    const fuelType = car?.fuelType || 'Diesel'
    const trend = generatePriceTrend('brisbane', fuelType, 30)
    setData(trend)
  }, [car])

  if (data.length === 0) return null

  const todayPrice = data[data.length - 1]?.price || 0

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-text-secondary text-xs">30-Day Price Trend</p>
          <p className="font-heading font-bold text-lg">{car?.fuelType || 'Diesel'} in Brisbane</p>
        </div>
        <div className="text-right">
          <p className="text-text-secondary text-xs">Today</p>
          <p className="price-ticker text-lg text-primary">{todayPrice.toFixed(1)}</p>
        </div>
      </div>

      <div className="h-[180px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF6A" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00FF6A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).getDate().toString()}
              tick={{ fill: '#8B8B8B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: '#8B8B8B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
              width={35}
              tickFormatter={(v) => v.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                background: '#141416',
                border: '1px solid #1F1F23',
                borderRadius: '8px',
                color: '#FAFAFA',
                fontSize: '12px',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${Number(value).toFixed(1)}c/L`, 'Price']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#00FF6A"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
            <ReferenceLine
              x={data[data.length - 1]?.date}
              stroke="#00FF6A"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
