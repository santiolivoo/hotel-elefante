'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface RoomTypeChartProps {
  data: Array<{
    roomName: string
    roomType: string
    reservations: number
    revenue: number
  }>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function RoomTypeChart({ data }: RoomTypeChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }))

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload[0]) {
      const data = props.payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.roomName}</p>
          <p className="text-sm text-gray-600">{data.roomType}</p>
          <p className="text-sm">
            <span className="font-medium">Reservas:</span> {data.reservations}
          </p>
          <p className="text-sm">
            <span className="font-medium">Ingresos:</span> {formatCurrency(data.revenue)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ roomName, percent }) => `${roomName} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="reservations"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
