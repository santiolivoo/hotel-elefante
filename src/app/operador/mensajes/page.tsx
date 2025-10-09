'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { formatDateTime } from '@/lib/utils'

export default function MensajesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [selectedMsg, setSelectedMsg] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => { loadMessages() }, [])

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/contact')
      setMessages(await res.json())
    } finally { setLoading(false) }
  }

  const sendReply = async (msgId: string) => {
    try {
      const res = await fetch(`/api/messages/${msgId}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: reply }) })
      if (res.ok) {
        toast({ title: 'Respuesta enviada' })
        setReply('')
        setSelectedMsg(null)
        loadMessages()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const statusColors: any = { RECEIVED: 'warning', ANSWERED: 'success', CLOSED: 'secondary' }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Mensajes de Contacto</h1>
      {loading ? <p>Cargando...</p> : (
        <div className="space-y-4">
          {messages.map(msg => (
            <Card key={msg.id}>
              <CardHeader><CardTitle className="flex items-center justify-between text-lg"><span>{msg.name}</span><Badge variant={statusColors[msg.status]}>{msg.status}</Badge></CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> {msg.email}</p>
                {msg.phone && <p className="text-sm"><strong>Teléfono:</strong> {msg.phone}</p>}
                <p className="text-sm"><strong>Asunto:</strong> {msg.subject}</p>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(msg.createdAt)}</p>
                <Dialog><DialogTrigger asChild><Button size="sm" onClick={() => setSelectedMsg(msg)}>Responder</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Responder a {msg.name}</DialogTitle></DialogHeader><div className="space-y-4"><Label>Mensaje Original</Label><p className="rounded bg-muted/20 p-3 text-sm">{msg.message}</p><Label>Tu Respuesta</Label><Textarea value={reply} onChange={e => setReply(e.target.value)} rows={5} /><Button onClick={() => sendReply(msg.id)}>Enviar Respuesta</Button></div></DialogContent></Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
