import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { Users, Bed } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HabitacionesPage() {
  const roomTypes = await prisma.roomType.findMany({
    include: {
      rooms: {
        where: {
          status: 'AVAILABLE',
        },
        take: 1,
        include: {
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
      },
    },
    orderBy: {
      basePrice: 'asc',
    },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Nuestras Habitaciones</h1>
            <p className="text-lg md:text-xl">
              Descubre el confort y la elegancia en cada una de nuestras suites
            </p>
          </div>
        </section>

        {/* Room Types */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {roomTypes.map((roomType) => {
                const sampleRoom = roomType.rooms[0]
                const images = sampleRoom?.images
                  ? JSON.parse(sampleRoom.images)
                  : ['/Imagenes del hotel/suite estandar.jpg']

                return (
                  <Card key={roomType.id} className="overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={images[0]}
                        alt={roomType.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute right-4 top-4">
                        <Badge className="bg-card text-primary">
                          {roomType.rooms.length} disponibles
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{roomType.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {roomType.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Hasta {roomType.maxGuests} huéspedes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{roomType.rooms.length} habitaciones</span>
                        </div>
                      </div>

                      {sampleRoom && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {sampleRoom.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity.amenityId} variant="secondary">
                              {amenity.amenity.name}
                            </Badge>
                          ))}
                          {sampleRoom.amenities.length > 4 && (
                            <Badge variant="secondary">+{sampleRoom.amenities.length - 4}</Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          {formatCurrency(Number(roomType.basePrice))}
                        </span>
                        <span className="text-sm text-muted-foreground">/ noche</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/habitaciones/${roomType.id}`}>Ver Detalles</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/reservar?roomType=${roomType.id}`}>Reservar</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>

            {roomTypes.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No hay tipos de habitaciones disponibles en este momento.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
