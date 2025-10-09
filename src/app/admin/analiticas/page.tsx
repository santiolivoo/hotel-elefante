'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, TrendingUp, Users, Calendar, Hotel, Clock, 
  Target, ArrowUpRight, ArrowDownRight, MapPin, Star,
  BarChart3, PieChart, Activity, UserCheck
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters'
import { RevenueChart } from '@/components/analytics/RevenueChart'
import { RoomTypeChart } from '@/components/analytics/RoomTypeChart'
import { OccupancyChart } from '@/components/analytics/OccupancyChart'
import { CancellationChart } from '@/components/analytics/CancellationChart'
import { LeadTimeChart } from '@/components/analytics/LeadTimeChart'
import { WeeklyHeatmap } from '@/components/analytics/WeeklyHeatmap'

export default function AnaliticasPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [dateRange, setDateRange] = useState<{from?: string, to?: string}>({})

  const fetchAnalytics = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (dateRange.from && dateRange.to) {
      params.append('from', dateRange.from)
      params.append('to', dateRange.to)
    } else {
      params.append('period', period)
    }
    
    try {
      const response = await fetch(`/api/admin/analytics?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Analytics data received:', data)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period, dateRange])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    setDateRange({})
  }

  const handleDateRangeChange = (from: string, to: string) => {
    setDateRange({ from, to })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">Cargando analíticas...</div>
    </div>
  )
  
  if (!analytics || !analytics.summary) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-red-600">Error al cargar analíticas</div>
    </div>
  )

  const { summary, charts } = analytics

  // Provide default values to prevent undefined errors
  const safeCharts = charts || {}
  const safeSummary = {
    revenue: 0,
    revpar: 0,
    totalReservations: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
    adr: 0,
    occupancyRate: 0,
    totalRooms: 0,
    avgLeadTime: 0,
    avgStayDuration: 0,
    conversionRate: 0,
    cancellationRate: 0,
    uniqueGuests: 0,
    returningGuestRate: 0,
    ...summary
  }

  // Función para determinar el color de variación
  const getVariationColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getVariationIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4" />
    if (value < 0) return <ArrowDownRight className="h-4 w-4" />
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 Analíticas y KPIs</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      <AnalyticsFilters 
        onPeriodChange={handlePeriodChange}
        onDateRangeChange={handleDateRangeChange}
        currentPeriod={period}
      />

      {/* KPIs Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💰 Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(safeSummary.revenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              RevPAR: {formatCurrency(safeSummary.revpar)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📅 Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeSummary.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              {safeSummary.confirmedReservations} confirmadas • {safeSummary.cancelledReservations} canceladas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🏨 ADR (Precio Medio)</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(safeSummary.adr)}</div>
            <p className="text-xs text-muted-foreground">por noche</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📈 Tasa Ocupación</CardTitle>
            <Hotel className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeSummary.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {safeSummary.totalRooms} habitaciones disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundarias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">⏱️ Lead Time Promedio</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeSummary.avgLeadTime} días</div>
            <p className="text-xs text-muted-foreground">
              Estadía promedio: {safeSummary.avgStayDuration} días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🎯 Tasa Conversión</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeSummary.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Cancelaciones: {safeSummary.cancellationRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">👥 Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeSummary.uniqueGuests}</div>
            <p className="text-xs text-muted-foreground">
              Recurrentes: {safeSummary.returningGuestRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💎 RevPAR</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(safeSummary.revpar)}</div>
            <p className="text-xs text-muted-foreground">
              Revenue per Available Room
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y Análisis Detallados */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">📊 Rendimiento</TabsTrigger>
          <TabsTrigger value="operations">🕒 Operaciones</TabsTrigger>
          <TabsTrigger value="customers">👥 Clientes</TabsTrigger>
          <TabsTrigger value="rooms">🏨 Habitaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ingresos por Mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={safeCharts.revenueByMonth || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Cancelaciones vs Confirmadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CancellationChart data={safeCharts.cancellationVsConfirmed || []} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ocupación Diaria (Últimos 30 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OccupancyChart 
                data={safeCharts.dailyOccupancy || []} 
                totalRooms={safeSummary.totalRooms}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Lead Time vs Duración de Estadía
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadTimeChart data={safeCharts.leadTimeData || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Mapa de Calor Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyHeatmap data={safeCharts.weeklyOccupancy || []} />
              </CardContent>
            </Card>
          </div>

          {/* Top 5 Habitaciones Más Rentables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top 5 Habitaciones Más Rentables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {safeCharts.topRooms?.slice(0, 5).map((room: any, index: number) => (
                  <div key={room.roomName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{room.roomName}</div>
                        <div className="text-sm text-gray-600">{room.roomType}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatCurrency(room.revenue)}</div>
                      <div className="text-sm text-gray-600">{room.reservations} reservas</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Análisis de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Clientes únicos</span>
                    <span className="text-2xl font-bold text-blue-600">{safeSummary.uniqueGuests}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Tasa de retorno</span>
                    <span className="text-2xl font-bold text-green-600">{safeSummary.returningGuestRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Lead time promedio</span>
                    <span className="text-2xl font-bold text-purple-600">{safeSummary.avgLeadTime} días</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Canales de Reserva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Reservas directas</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Agencias online</span>
                    <span className="font-bold">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Reservas por Tipo de Habitación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoomTypeChart data={safeCharts.reservationsByRoomType || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
