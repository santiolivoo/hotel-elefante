'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Filter } from 'lucide-react'

interface AnalyticsFiltersProps {
  onPeriodChange: (period: string) => void
  onDateRangeChange: (from: string, to: string) => void
  currentPeriod: string
}

export function AnalyticsFilters({ onPeriodChange, onDateRangeChange, currentPeriod }: AnalyticsFiltersProps) {
  const [customRange, setCustomRange] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const periods = [
    { value: '7', label: 'Últimos 7 días' },
    { value: '30', label: 'Últimos 30 días' },
    { value: '90', label: 'Últimos 3 meses' },
    { value: '365', label: 'Último año' }
  ]

  const handleCustomRange = () => {
    if (fromDate && toDate) {
      onDateRangeChange(fromDate, toDate)
      setCustomRange(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Período:</span>
          </div>
          
          {periods.map(period => (
            <Button
              key={period.value}
              variant={currentPeriod === period.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPeriodChange(period.value)}
            >
              {period.label}
            </Button>
          ))}
          
          <Button
            variant={customRange ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCustomRange(!customRange)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Rango personalizado
          </Button>
        </div>
        
        {customRange && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Desde:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Hasta:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <Button size="sm" onClick={handleCustomRange}>
              Aplicar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
