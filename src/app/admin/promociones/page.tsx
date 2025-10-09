'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  Mail, 
  Send, 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react'

interface Promotion {
  id: string
  subject: string
  content: string
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
  targetAudience: string
  recipientCount: number
  sentCount: number
  failedCount: number
  status: string
  createdAt: string
  sentAt?: string
  sentByUser: {
    name: string
    email: string
  }
}

export default function PromocionesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
    targetAudience: 'ALL',
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/admin/promotions')
      if (response.ok) {
        const data = await response.json()
        setPromotions(data)
      }
    } catch (error) {
      console.error('Error al cargar promociones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const response = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: '✅ Promoción enviada',
          description: `Enviada a ${result.results.sent} de ${result.results.totalRecipients} destinatarios (${result.results.successRate}% éxito)`,
        })
        
        // Reset form
        setFormData({
          subject: '',
          content: '',
          imageUrl: '',
          ctaText: '',
          ctaUrl: '',
          targetAudience: 'ALL',
        })
        setShowForm(false)
        fetchPromotions()
      } else {
        const error = await response.json()
        toast({
          title: '❌ Error',
          description: error.error || 'Error al enviar promoción',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Error de conexión',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: 'Borrador', variant: 'secondary' as const, icon: Clock },
      SENDING: { label: 'Enviando', variant: 'default' as const, icon: Send },
      SENT: { label: 'Enviado', variant: 'default' as const, icon: CheckCircle },
      PARTIALLY_SENT: { label: 'Parcial', variant: 'destructive' as const, icon: AlertCircle },
      FAILED: { label: 'Fallido', variant: 'destructive' as const, icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getAudienceLabel = (audience: string) => {
    const labels = {
      ALL: 'Todos los usuarios',
      ACTIVE_CUSTOMERS: 'Clientes activos',
      VIP_CUSTOMERS: 'Clientes VIP',
    }
    return labels[audience as keyof typeof labels] || audience
  }

  const getAudienceIcon = (audience: string) => {
    const icons = {
      ALL: Users,
      ACTIVE_CUSTOMERS: Mail,
      VIP_CUSTOMERS: Star,
    }
    return icons[audience as keyof typeof icons] || Users
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando promociones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📧 Promociones</h1>
          <p className="text-muted-foreground">
            Envía promociones y ofertas especiales a tus clientes
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Promoción
        </Button>
      </div>

      {/* Formulario de nueva promoción */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Nueva Promoción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ej: ¡Oferta especial del 20% de descuento!"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Audiencia</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Todos los usuarios
                        </div>
                      </SelectItem>
                      <SelectItem value="ACTIVE_CUSTOMERS">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Clientes activos
                        </div>
                      </SelectItem>
                      <SelectItem value="VIP_CUSTOMERS">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Clientes VIP
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe el contenido de tu promoción aquí..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaText">Texto del Botón (opcional)</Label>
                  <Input
                    id="ctaText"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Ej: Reservar Ahora"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">URL del Botón (opcional)</Label>
                  <Input
                    id="ctaUrl"
                    type="url"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    placeholder="https://hotelelefante.com/reservar"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={sending} className="gap-2">
                  <Send className="h-4 w-4" />
                  {sending ? 'Enviando...' : 'Enviar Promoción'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Historial de promociones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Historial de Promociones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay promociones</h3>
              <p className="text-muted-foreground mb-4">
                Aún no has enviado ninguna promoción.
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear primera promoción
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => {
                const AudienceIcon = getAudienceIcon(promotion.targetAudience)
                return (
                  <div
                    key={promotion.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{promotion.subject}</h3>
                          {getStatusBadge(promotion.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {promotion.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <AudienceIcon className="h-4 w-4" />
                            {getAudienceLabel(promotion.targetAudience)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {promotion.sentCount}/{promotion.recipientCount} enviados
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(promotion.createdAt).toLocaleDateString('es-AR')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {promotion.sentByUser.name}
                        </p>
                        {promotion.sentAt && (
                          <p className="text-xs text-muted-foreground">
                            Enviado: {new Date(promotion.sentAt).toLocaleString('es-AR')}
                          </p>
                        )}
                        {promotion.failedCount > 0 && (
                          <p className="text-xs text-destructive">
                            {promotion.failedCount} fallos
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
