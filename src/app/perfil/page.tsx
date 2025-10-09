'use client'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PerfilPage() {
  const { data: session } = useSession()

  if (!session) return null

  const roleLabels: any = {
    USER: 'Usuario',
    OPERATOR: 'Operador',
    ADMIN: 'Administrador',
  }

  const roleColors: any = {
    USER: 'default',
    OPERATOR: 'secondary',
    ADMIN: 'destructive',
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <h1 className="mb-8 text-3xl font-bold">Mi Perfil</h1>
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                <p className="text-lg">{session.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{session.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rol</label>
                <div className="mt-1">
                  <Badge variant={roleColors[session.user.role]}>
                    {roleLabels[session.user.role]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
