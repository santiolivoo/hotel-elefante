'use client'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LeadTimeChartProps {
  data: Array<{
    leadTime: number
    stayDuration: number
    date: string
  }>
}

export function LeadTimeChart({ data }: LeadTimeChartProps) {
  const formatTooltip = (value: any, name: string) => {
    if (name === 'leadTime') {
      return [`${value} días`, 'Lead Time']
    }
    if (name === 'stayDuration') {
      return [`${value} días`, 'Duración de Estadía']
    }
    return [value, name]
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="leadTime" 
            name="Lead Time (días)"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            type="number" 
            dataKey="stayDuration" 
            name="Duración (días)"
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
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter 
            name="Reservas" 
            data={data} 
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
