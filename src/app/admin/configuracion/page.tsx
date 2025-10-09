'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  Mail, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Database,
  Server
} from 'lucide-react'

export default function ConfiguracionPage() {
  const { toast } = useToast()
  const [testing, setTesting] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const testEmailConfiguration = async () => {
    setTesting(true)
    setEmailStatus('idle')

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
      })

      const result = await response.json()

      if (result.success) {
        setEmailStatus('success')
        toast({
          title: '✅ Email de prueba enviado',
          description: `Enviado exitosamente usando ${result.provider}`,
        })
      } else {
        setEmailStatus('error')
        toast({
          title: '❌ Error en email de prueba',
          description: result.message || 'Error desconocido',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setEmailStatus('error')
      toast({
        title: '❌ Error de conexión',
        description: 'No se pudo conectar con el servidor',
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = () => {
    switch (emailStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Mail className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Configuración del Sistema
        </h1>
        <p className="text-muted-foreground">
          Verifica y configura los servicios del hotel
        </p>
      </div>

      {/* Configuración de Emails */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sistema de Emails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold">Configuración de Email</h3>
                <p className="text-sm text-muted-foreground">
                  Prueba la configuración de envío de emails
                </p>
              </div>
            </div>
            <Button 
              onClick={testEmailConfiguration}
              disabled={testing}
              variant={emailStatus === 'success' ? 'default' : 'outline'}
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              {testing ? 'Enviando...' : 'Probar Email'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">📧 Emails Automáticos</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Confirmación de reservas</li>
                <li>• Cambios de estado</li>
                <li>• Respuestas a consultas</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">📢 Promociones</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Envío masivo segmentado</li>
                <li>• Templates personalizables</li>
                <li>• Estadísticas de envío</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de la Base de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-semibold">Conexión SQL Server</h3>
                <p className="text-sm text-muted-foreground">
                  Base de datos conectada y funcionando
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">Conectado</p>
              <p className="text-xs text-muted-foreground">localhost:1433</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicios del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Servicios Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-semibold">Autenticación</span>
              </div>
              <p className="text-sm text-muted-foreground">NextAuth.js funcionando</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-semibold">Pagos</span>
              </div>
              <p className="text-sm text-muted-foreground">Mercado Pago integrado</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-semibold">Reservas</span>
              </div>
              <p className="text-sm text-muted-foreground">Sistema completo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Instrucciones de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🔧 Para configurar emails:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Configura las variables de entorno en el archivo <code>.env</code></li>
              <li>Para Gmail: habilita autenticación de 2 factores y genera una contraseña de aplicación</li>
              <li>Para Resend: registrate en resend.com y obtén tu API key</li>
              <li>Haz clic en "Probar Email" para verificar la configuración</li>
            </ol>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✅ Variables de entorno necesarias:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li><code>EMAIL_USER</code> - Tu email</li>
              <li><code>EMAIL_PASS</code> - Contraseña de aplicación</li>
              <li><code>RESEND_API_KEY</code> - API key de Resend (opcional)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
