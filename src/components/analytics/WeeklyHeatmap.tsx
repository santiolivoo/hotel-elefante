'use client'
import { ResponsiveContainer, Cell } from 'recharts'

interface WeeklyHeatmapProps {
  data: Array<{
    dayOfWeek: number
    weekNumber: number
    reservations: number
  }>
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  // Crear matriz de datos para el heatmap
  const maxReservations = Math.max(...data.map(d => d.reservations), 1)
  const weeks = [...new Set(data.map(d => d.weekNumber))].sort()
  
  const getIntensity = (reservations: number) => {
    const intensity = reservations / maxReservations
    return `rgba(16, 185, 129, ${Math.max(0.1, intensity)})`
  }

  const getReservationsForDay = (week: number, day: number) => {
    const item = data.find(d => d.weekNumber === week && d.dayOfWeek === day)
    return item ? item.reservations : 0
  }

  return (
    <div className="h-80 p-4">
      <div className="grid grid-cols-8 gap-1 h-full">
        {/* Header con días de la semana */}
        <div></div>
        {DAYS.map((day, index) => (
          <div key={day} className="text-xs font-medium text-center flex items-center justify-center">
            {day}
          </div>
        ))}
        
        {/* Filas de semanas */}
        {weeks.map(week => (
          <div key={week} className="contents">
            <div className="text-xs font-medium flex items-center justify-center">
              S{week}
            </div>
            {[1, 2, 3, 4, 5, 6, 7].map(day => {
              const reservations = getReservationsForDay(week, day)
              return (
                <div
                  key={`${week}-${day}`}
                  className="aspect-square rounded border border-gray-200 flex items-center justify-center text-xs font-medium cursor-pointer hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: getIntensity(reservations) }}
                  title={`Semana ${week}, ${DAYS[day - 1]}: ${reservations} reservas`}
                >
                  {reservations > 0 ? reservations : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-600">
        <span>Menos</span>
        {[0.1, 0.3, 0.5, 0.7, 1].map(intensity => (
          <div
            key={intensity}
            className="w-3 h-3 rounded border border-gray-200"
            style={{ backgroundColor: `rgba(16, 185, 129, ${intensity})` }}
          />
        ))}
        <span>Más</span>
      </div>
    </div>
  )
}
