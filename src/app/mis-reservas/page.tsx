'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Calendar, MapPin } from 'lucide-react'

export default function MisReservasPage() {
  const { data: session } = useSession()
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch('/api/reservations').then(r => r.json()).then(data => { setReservations(data); setLoading(false) })
    }
  }, [session])

  const statusColors: any = { PENDING_PAYMENT: 'warning', CONFIRMED: 'success', CANCELLED: 'destructive', CHECKED_IN: 'default', CHECKED_OUT: 'secondary' }
  const statusLabels: any = { PENDING_PAYMENT: 'Pendiente de Pago', CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada', CHECKED_IN: 'Check-in', CHECKED_OUT: 'Check-out' }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">Mis Reservas</h1>
          {loading ? <p>Cargando...</p> : reservations.length === 0 ? (
            <Card><CardContent className="pt-6 text-center"><p className="text-muted-foreground">No tienes reservas aún</p><Button className="mt-4" asChild><a href="/habitaciones">Ver Habitaciones</a></Button></CardContent></Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reservations.map(res => (
                <Card key={res.id}>
                  <CardHeader><CardTitle className="flex items-center justify-between"><span>Habitación {res.room.number}</span><Badge variant={statusColors[res.status]}>{statusLabels[res.status]}</Badge></CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{res.room.roomType.name}</p>
                    <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4" /><span>{formatDate(res.checkIn)} - {formatDate(res.checkOut)}</span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /><span>{res.guests} huéspedes</span></div>
                    <p className="text-2xl font-bold">{formatCurrency(Number(res.totalAmount))}</p>
                    {res.status === 'PENDING_PAYMENT' && <Button className="w-full">Pagar Ahora</Button>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
