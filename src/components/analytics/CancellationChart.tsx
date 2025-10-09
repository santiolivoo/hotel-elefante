'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CancellationChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export function CancellationChart({ data }: CancellationChartProps) {
  const formatTooltip = (value: any, name: string) => {
    return [value, name === 'value' ? 'Reservas' : name]
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            width={100}
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
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
