import Link from 'next/link'
import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Hotel Elefante</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu destino ideal en San Lorenzo, Salta. Cerca del emblemático Cerro Elefante.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/habitaciones" className="text-muted-foreground hover:text-primary">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-muted-foreground hover:text-primary">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/reservar" className="text-muted-foreground hover:text-primary">
                  Reservar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Política de Cancelación
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  San Lorenzo, Salta
                  <br />
                  Argentina
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+54 387 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@hotelelefante.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hotel Elefante. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">
            Proyecto académico - Desarrollado con Next.js, Prisma y SQL Server
          </p>
        </div>
      </div>
    </footer>
  )
}
