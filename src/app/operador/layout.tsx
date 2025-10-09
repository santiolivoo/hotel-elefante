import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Calendar, MessageSquare } from 'lucide-react'

export default async function OperadorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) redirect('/')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/30 p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operador/mapa"><LayoutGrid className="mr-2 h-4 w-4" />Mapa Habitaciones</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operador/reservas"><Calendar className="mr-2 h-4 w-4" />Reservas</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operador/mensajes"><MessageSquare className="mr-2 h-4 w-4" />Mensajes</Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
