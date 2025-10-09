'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { DoorOpen, DoorClosed, Users } from 'lucide-react'

export default function MapaPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [closeForm, setCloseForm] = useState({ reason: '', from: '', to: '' })
  const { toast } = useToast()

  useEffect(() => { loadRooms() }, [])

  const loadRooms = async () => {
    try {
      const res = await fetch('/api/rooms')
      setRooms(await res.json())
    } finally { setLoading(false) }
  }

  const openRoom = async (roomId: number) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/open`, { method: 'POST' })
      if (res.ok) {
        toast({ title: 'Habitación abierta' })
        loadRooms()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const closeRoom = async (roomId: number) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/close`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(closeForm) })
      if (res.ok) {
        toast({ title: 'Habitación cerrada' })
        setCloseForm({ reason: '', from: '', to: '' })
        setSelectedRoom(null)
        loadRooms()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const statusColors: any = { AVAILABLE: 'success', OCCUPIED: 'warning', CLOSED: 'destructive', CLEANING: 'secondary' }
  const statusLabels: any = { AVAILABLE: 'Disponible', OCCUPIED: 'Ocupada', CLOSED: 'Cerrada', CLEANING: 'Limpieza' }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Mapa de Habitaciones</h1>
      {loading ? <p>Cargando...</p> : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {rooms.map(room => (
            <Card key={room.id} className="hover:shadow-lg">
              <CardHeader><CardTitle className="flex items-center justify-between">Hab. {room.number}<Badge variant={statusColors[room.status]}>{statusLabels[room.status]}</Badge></CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{room.roomType.name}</p>
                <p className="text-xs text-muted-foreground">Piso {room.floor}</p>
                <div className="flex gap-2">
                  {room.status === 'CLOSED' ? (
                    <Button size="sm" variant="outline" onClick={() => openRoom(room.id)} className="w-full"><DoorOpen className="mr-1 h-4 w-4" />Abrir</Button>
                  ) : (
                    <Dialog><DialogTrigger asChild><Button size="sm" variant="outline" onClick={() => setSelectedRoom(room)} className="w-full"><DoorClosed className="mr-1 h-4 w-4" />Cerrar</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Cerrar Habitación {room.number}</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Motivo</Label><Textarea value={closeForm.reason} onChange={e => setCloseForm({...closeForm, reason: e.target.value})} /></div><div><Label>Desde</Label><Input type="date" value={closeForm.from} onChange={e => setCloseForm({...closeForm, from: e.target.value})} /></div><div><Label>Hasta</Label><Input type="date" value={closeForm.to} onChange={e => setCloseForm({...closeForm, to: e.target.value})} /></div><Button onClick={() => closeRoom(room.id)}>Confirmar Cierre</Button></div></DialogContent></Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
