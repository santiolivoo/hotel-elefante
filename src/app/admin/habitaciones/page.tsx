'use client'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function HabitacionesAdminPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => { loadRooms() }, [])

  const loadRooms = async () => {
    try {
      const res = await fetch('/api/rooms')
      setRooms(await res.json())
    } finally { setLoading(false) }
  }

  const deleteRoom = async (id: number) => {
    if (!confirm('¿Eliminar habitación?')) return
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Habitación eliminada' })
        loadRooms()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const statusColors: any = { AVAILABLE: 'success', OCCUPIED: 'warning', CLOSED: 'destructive', CLEANING: 'secondary' }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Habitaciones</h1>
        <Button><Plus className="mr-2 h-4 w-4" />Nueva Habitación</Button>
      </div>
      {loading ? <p>Cargando...</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Número</TableHead><TableHead>Tipo</TableHead><TableHead>Piso</TableHead><TableHead>Estado</TableHead><TableHead>Precio Base</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {rooms.map(room => (
              <TableRow key={room.id}>
                <TableCell className="font-semibold">Hab. {room.number}</TableCell>
                <TableCell>{room.roomType.name}</TableCell>
                <TableCell>Piso {room.floor}</TableCell>
                <TableCell><Badge variant={statusColors[room.status]}>{room.status}</Badge></TableCell>
                <TableCell>${Number(room.roomType.basePrice).toLocaleString()}</TableCell>
                <TableCell className="space-x-2"><Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteRoom(room.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
