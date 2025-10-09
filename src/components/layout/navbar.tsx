'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Mountain, User, LogOut, Settings, Calendar, LayoutDashboard } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Hotel Elefante</span>
        </Link>

        <div className="ml-auto flex items-center space-x-6">
          <Link
            href="/habitaciones"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/habitaciones') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Habitaciones
          </Link>
          <Link
            href="/servicios"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/servicios') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Servicios
          </Link>
          <Link
            href="/contacto"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/contacto') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Contacto
          </Link>

          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {session.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {session.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/habitaciones">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {(session.user.role === 'OPERATOR' || session.user.role === 'ADMIN') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/operador/mapa">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Panel Operador
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/mis-reservas">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mis Reservas
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/perfil">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Ingresar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
