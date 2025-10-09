import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HotelMap } from '@/components/map/hotel-map'
import {
  Wifi,
  Coffee,
  Wine,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Mountain,
  Star,
  MapPin,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="/Imagenes del hotel/Imagen de fondo inicio.jpg"
          alt="Hotel Elefante - San Lorenzo, Salta"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center text-white">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">Bienvenido a Hotel Elefante</h1>
            <p className="mb-2 text-xl md:text-2xl">
              Tu refugio de lujo en San Lorenzo, Salta
            </p>
            <p className="mb-8 flex items-center justify-center text-lg">
              <MapPin className="mr-2 h-5 w-5" />
              Cerca del emblemático Cerro Elefante
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/reservar">Reservar Ahora</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-background/10 text-white hover:bg-background/20" asChild>
                <Link href="/habitaciones">Ver Habitaciones</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">¿Por qué elegirnos?</h2>
            <p className="text-muted-foreground">
              Experimenta el mejor servicio hotelero en el corazón de San Lorenzo
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Mountain className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Ubicación Privilegiada</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cerca del Cerro Elefante y en el corazón de San Lorenzo, con acceso a todas las
                  atracciones turísticas de Salta.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Servicio de Excelencia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nuestro equipo está dedicado a brindarle la mejor experiencia, con atención
                  personalizada las 24 horas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <UtensilsCrossed className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Gastronomía Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Disfrute de nuestra cocina gourmet con platos regionales e internacionales en
                  nuestro restaurante.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nuestros Servicios</h2>
            <p className="text-muted-foreground">
              Todo lo que necesitas para una estadía inolvidable
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">WiFi Gratis</h3>
              <p className="text-sm text-muted-foreground">
                Internet de alta velocidad en todas las instalaciones
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Desayuno Buffet</h3>
              <p className="text-sm text-muted-foreground">
                Buffet completo con opciones regionales e internacionales
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Waves className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Piscina</h3>
              <p className="text-sm text-muted-foreground">
                Piscina climatizada y bar junto a la piscina
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Gimnasio</h3>
              <p className="text-sm text-muted-foreground">
                Centro de fitness equipado con equipos modernos
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Restaurante Gourmet</h3>
              <p className="text-sm text-muted-foreground">
                Cocina de autor con productos de la región
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Wine className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Bar & Casino</h3>
              <p className="text-sm text-muted-foreground">
                Bar de cócteles y acceso directo al casino
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/servicios">Ver Todos los Servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nuestras Habitaciones</h2>
            <p className="text-muted-foreground">
              Elige la habitación perfecta para tu estadía
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/Imagenes del hotel/suite estandar.jpg"
                  alt="Suite Standard"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Suite Standard</CardTitle>
                <CardDescription>Desde $12.000 / noche</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Habitación acogedora con todas las comodidades básicas. Ideal para viajeros
                  individuales o parejas.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/Imagenes del hotel/suite deluxe.jpg"
                  alt="Suite Deluxe"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Suite Deluxe</CardTitle>
                <CardDescription>Desde $28.000 / noche</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suite de lujo con dormitorio separado, sala de estar y baño premium con jacuzzi.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/Imagenes del hotel/suite presi.jpg"
                  alt="Suite VIP"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Suite VIP</CardTitle>
                <CardDescription>Desde $45.000 / noche</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nuestra mejor suite con terraza privada, jacuzzi exterior y servicio
                  personalizado 24/7.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/habitaciones">Ver Todas las Habitaciones</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nuestra Ubicación</h2>
            <p className="text-muted-foreground">
              En el corazón de San Lorenzo, Salta - Cerca del emblemático Cerro Elefante
            </p>
          </div>
          <div className="h-[450px] w-full">
            <HotelMap />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">¿Listo para tu próxima aventura?</h2>
          <p className="mb-8 text-lg">
            Reserva ahora y disfruta de una experiencia única en San Lorenzo, Salta
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/reservar">Reservar Ahora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
