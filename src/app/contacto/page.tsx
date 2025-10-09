'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { HotelMap } from '@/components/map/hotel-map'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactoPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast({ title: 'Mensaje enviado', description: 'Nos contactaremos pronto' })
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        throw new Error()
      }
    } catch {
      toast({ title: 'Error', description: 'Error al enviar mensaje', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container">
            <h1 className="mb-4 text-4xl font-bold">Contacto</h1>
            <p className="text-lg">Estamos aquí para ayudarte</p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Envíanos un Mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Asunto</Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Mensaje</Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Dirección</h3>
                        <p className="text-sm text-muted-foreground">
                          San Lorenzo, Salta, Argentina
                          <br />
                          En el Cerro Elefante
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Teléfono</h3>
                        <p className="text-sm text-muted-foreground">+54 9 387 5850581</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-sm text-muted-foreground">info@hotelelefante.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-3xl font-bold">Ubicación</h2>
              <p className="text-muted-foreground">
                Encuéntranos en San Lorenzo, Salta - Cerca del Cerro Elefante
              </p>
            </div>
            <div className="h-[500px] w-full">
              <HotelMap />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
