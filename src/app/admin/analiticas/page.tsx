'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AnaliticasPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(data => { setAnalytics(data); setLoading(false) })
  }, [])

  if (loading) return <p>Cargando...</p>
  if (!analytics) return <p>Error al cargar analíticas</p>

  const { summary } = analytics

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Analíticas y KPIs</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(summary.revenue)}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Reservas</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summary.totalReservations}</div><p className="text-xs text-muted-foreground">{summary.confirmedReservations} confirmadas</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">ADR (Precio Medio)</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(summary.adr)}</div><p className="text-xs text-muted-foreground">por noche</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summary.conversionRate}%</div><p className="text-xs text-muted-foreground">Lead time: {summary.avgLeadTime} días</p></CardContent></Card>
      </div>
    </div>
  )
}
