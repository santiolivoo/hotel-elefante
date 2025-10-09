'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OccupancyChartProps {
  data: Array<{
    date: string
    occupied_rooms: number
  }>
  totalRooms: number
}

export function OccupancyChart({ data, totalRooms }: OccupancyChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'dd/MM', { locale: es }),
    occupancyRate: totalRooms > 0 ? (item.occupied_rooms / totalRooms) * 100 : 0
  }))

  const formatTooltip = (value: any, name: string) => {
    if (name === 'occupancyRate') {
      return [`${value.toFixed(1)}%`, 'Tasa de Ocupación']
    }
    return [value, 'Habitaciones Ocupadas']
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="rooms"
            orientation="left"
            tick={{ fontSize: 12 }}
            domain={[0, totalRooms]}
          />
          <YAxis 
            yAxisId="rate"
            orientation="right"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
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
            yAxisId="rooms"
            type="monotone" 
            dataKey="occupied_rooms" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
          />
          <Line 
            yAxisId="rate"
            type="monotone" 
            dataKey="occupancyRate" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
