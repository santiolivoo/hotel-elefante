'use client'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function ReservasPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => { loadReservations() }, [])

  const loadReservations = async () => {
    try {
      const res = await fetch('/api/reservations')
      setReservations(await res.json())
    } finally { setLoading(false) }
  }

  const changeStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (res.ok) {
        toast({ title: 'Estado actualizado' })
        loadReservations()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const statusColors: any = { PENDING_PAYMENT: 'warning', CONFIRMED: 'success', CANCELLED: 'destructive', CHECKED_IN: 'default', CHECKED_OUT: 'secondary' }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Gestión de Reservas</h1>
      {loading ? <p>Cargando...</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Cliente</TableHead><TableHead>Habitación</TableHead><TableHead>Check-in</TableHead><TableHead>Check-out</TableHead><TableHead>Monto</TableHead><TableHead>Estado</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {reservations.map(res => (
              <TableRow key={res.id}>
                <TableCell className="font-mono text-xs">{res.id.slice(0, 8)}</TableCell>
                <TableCell>{res.user.name}</TableCell>
                <TableCell>Hab. {res.room.number}</TableCell>
                <TableCell>{formatDate(res.checkIn)}</TableCell>
                <TableCell>{formatDate(res.checkOut)}</TableCell>
                <TableCell>{formatCurrency(Number(res.totalAmount))}</TableCell>
                <TableCell><Badge variant={statusColors[res.status]}>{res.status}</Badge></TableCell>
                <TableCell><Select value={res.status} onValueChange={v => changeStatus(res.id, v)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PENDING_PAYMENT">Pendiente Pago</SelectItem><SelectItem value="CONFIRMED">Confirmada</SelectItem><SelectItem value="CHECKED_IN">Check-in</SelectItem><SelectItem value="CHECKED_OUT">Check-out</SelectItem><SelectItem value="CANCELLED">Cancelada</SelectItem></SelectContent></Select></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
