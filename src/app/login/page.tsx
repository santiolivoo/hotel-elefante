'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Mountain } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Credenciales inválidas',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Éxito',
          description: 'Sesión iniciada correctamente',
        })
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al iniciar sesión',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <Mountain className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Hotel Elefante - Ingresa a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">¿No tienes cuenta?</span>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Volver al inicio
            </Link>
          </div>

          <div className="mt-6 rounded-lg bg-secondary/20 p-4 text-sm">
            <p className="mb-2 font-semibold">Usuarios de prueba:</p>
            <p className="text-xs text-muted-foreground">
              Admin: admin@hotelelefante.com / admin123
            </p>
            <p className="text-xs text-muted-foreground">
              Operador: operador1@hotelelefante.com / operator123
            </p>
            <p className="text-xs text-muted-foreground">
              Cliente: cliente1@example.com / user123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
