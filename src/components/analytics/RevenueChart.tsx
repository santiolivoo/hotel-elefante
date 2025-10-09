'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface RevenueChartProps {
  data: Array<{
    month: string
    revenue: number
    reservations: number
  }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatTooltip = (value: any, name: string) => {
    if (name === 'revenue') {
      return [formatCurrency(value), 'Ingresos']
    }
    return [value, 'Reservas']
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="revenue"
            orientation="left"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="reservations"
            orientation="right"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Line 
            yAxisId="revenue"
            type="monotone" 
            dataKey="revenue" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
          <Line 
            yAxisId="reservations"
            type="monotone" 
            dataKey="reservations" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
