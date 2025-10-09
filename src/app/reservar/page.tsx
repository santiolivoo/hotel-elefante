'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency, calculateNights } from '@/lib/utils'

function ReservarForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const [selectedRoomType, setSelectedRoomType] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    fetch('/api/room-types').then(r => r.json()).then(setRoomTypes)
    const roomTypeParam = searchParams.get('roomType')
    if (roomTypeParam) setSelectedRoomType(roomTypeParam)
  }, [status, router, searchParams])

  const selectedRoomTypeData = roomTypes.find(rt => rt.id.toString() === selectedRoomType)
  const availableRooms = selectedRoomTypeData?.rooms || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoom || !checkIn || !checkOut) {
      toast({ title: 'Error', description: 'Completa todos los campos', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: parseInt(selectedRoom),
          checkIn,
          checkOut,
          guests: parseInt(guests),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      const reservation = await res.json()
      toast({ title: 'Reserva creada', description: 'Procede al pago' })
      router.push(`/mis-reservas`)
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = selectedRoomTypeData && checkIn && checkOut
    ? Number(selectedRoomTypeData.basePrice) * calculateNights(new Date(checkIn), new Date(checkOut))
    : 0

  return (
    <main className="flex-1 py-16">
      <div className="container max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Realizar Reserva</h1>
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Tipo de Habitación</Label>
                  <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(rt => (
                        <SelectItem key={rt.id} value={rt.id.toString()}>
                          {rt.name} - {formatCurrency(Number(rt.basePrice))}/noche
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Habitación Específica</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom} disabled={!selectedRoomType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona habitación" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room: any) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          Habitación {room.number} - Piso {room.floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Check-in</Label>
                  <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                </div>

                <div>
                  <Label>Check-out</Label>
                  <Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required min={checkIn} />
                </div>

                <div>
                  <Label>Número de Huéspedes</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {totalAmount > 0 && (
                <Card className="border-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-3xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {checkIn && checkOut && calculateNights(new Date(checkIn), new Date(checkOut))} noches
                    </p>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function ReservarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={
        <main className="flex-1 py-16">
          <div className="container max-w-4xl">
            <p>Cargando...</p>
          </div>
        </main>
      }>
        <ReservarForm />
      </Suspense>
      <Footer />
    </div>
  )
}
