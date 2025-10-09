import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { Users, Maximize, Wifi, Coffee } from 'lucide-react'

export default async function HabitacionDetailPage({ params }: { params: { id: string } }) {
  const roomType = await prisma.roomType.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      rooms: {
        where: { status: 'AVAILABLE' },
        include: {
          amenities: {
            include: { amenity: true },
          },
        },
      },
    },
  })

  if (!roomType) notFound()

  const sampleRoom = roomType.rooms[0]
  const images = sampleRoom?.images ? JSON.parse(sampleRoom.images) : ['/Imagenes del hotel/suite estandar.jpg']

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="relative h-[400px] overflow-hidden rounded-lg">
                  <Image src={images[0]} alt={roomType.name} fill className="object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.slice(1, 4).map((img: string, idx: number) => (
                      <div key={idx} className="relative h-24 overflow-hidden rounded-lg">
                        <Image src={img} alt={`${roomType.name} ${idx + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="mb-2 text-4xl font-bold">{roomType.name}</h1>
                  <p className="text-lg text-muted-foreground">{roomType.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>Hasta {roomType.maxGuests} huéspedes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-muted-foreground" />
                    <span>{roomType.rooms.length} habitaciones disponibles</span>
                  </div>
                </div>

                {sampleRoom && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Amenidades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {sampleRoom.amenities.map((amenity) => (
                          <div key={amenity.amenityId} className="flex items-center gap-2">
                            <Badge variant="outline">{amenity.amenity.name}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-primary">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{formatCurrency(Number(roomType.basePrice))}</span>
                      <span className="text-muted-foreground">/ noche</span>
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <Link href={`/reservar?roomType=${roomType.id}`}>Reservar Ahora</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
