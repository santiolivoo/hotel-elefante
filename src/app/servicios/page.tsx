import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  { title: 'Restaurante Gourmet', description: 'Cocina de autor con platos regionales e internacionales', image: '/Imagenes del hotel/Restaurante Gourmet.jpg' },
  { title: 'Desayuno Buffet', description: 'Buffet completo con opciones dulces y saladas', image: '/Imagenes del hotel/Desayuno Buffet.jpg' },
  { title: 'Bar junto a la Piscina', description: 'Cócteles tropicales y bebidas refrescantes', image: '/Imagenes del hotel/Bar junto a la piscina.jpg' },
  { title: 'Gimnasio', description: 'Centro de fitness equipado', image: '/Imagenes del hotel/GYM.jpg' },
  { title: 'Masajes Corporales', description: 'Spa y tratamientos de relajación', image: '/Imagenes del hotel/Masajes Corporales.jpg' },
  { title: 'Servicio a la Habitación', description: 'Disponible 24/7', image: '/Imagenes del hotel/Servicio a la habitacion.jpg' },
  { title: 'Lavandería', description: 'Servicio de lavandería y planchado', image: '/Imagenes del hotel/Servicio de Lavanderia.jpg' },
  { title: 'Acceso a Casino', description: 'Casino en el hotel', image: '/Imagenes del hotel/Acceso a casino.jpg' },
  { title: 'Tour por la Ciudad', description: 'Excursiones guiadas', image: '/Imagenes del hotel/Tour por la Ciudad.jpg' },
  { title: 'Parapente', description: 'Aventura en Salta', image: '/Imagenes del hotel/Servicio Parapente Salta.jpg' },
]

export default function ServiciosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container"><h1 className="mb-4 text-4xl font-bold">Nuestros Servicios</h1><p className="text-lg">Todo lo que necesitas para una estadía inolvidable</p></div>
        </section>
        <section className="py-16"><div className="container"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((service, idx) => (<Card key={idx} className="overflow-hidden"><div className="relative h-48"><Image src={service.image} alt={service.title} fill className="object-cover" /></div><CardHeader><CardTitle>{service.title}</CardTitle><CardDescription>{service.description}</CardDescription></CardHeader></Card>))}</div></div></section>
      </main>
      <Footer />
    </div>
  )
}
