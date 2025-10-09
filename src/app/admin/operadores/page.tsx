'use client'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, Power } from 'lucide-react'

export default function OperadoresPage() {
  const [operators, setOperators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => { loadOperators() }, [])

  const loadOperators = async () => {
    try {
      const res = await fetch('/api/admin/operators')
      setOperators(await res.json())
    } finally { setLoading(false) }
  }

  const createOperator = async () => {
    try {
      const res = await fetch('/api/admin/operators', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        toast({ title: 'Operador creado' })
        setForm({ name: '', email: '', password: '', phone: '' })
        setOpen(false)
        loadOperators()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/operators/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) })
      if (res.ok) {
        toast({ title: active ? 'Operador desactivado' : 'Operador activado' })
        loadOperators()
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Operadores</h1>
        <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nuevo Operador</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Crear Operador</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Nombre</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div><div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div><div><Label>Contraseña</Label><Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div><div><Label>Teléfono</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div><Button onClick={createOperator}>Crear</Button></div></DialogContent></Dialog>
      </div>
      {loading ? <p>Cargando...</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Teléfono</TableHead><TableHead>Estado</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {operators.map(op => (
              <TableRow key={op.id}>
                <TableCell>{op.name}</TableCell>
                <TableCell>{op.email}</TableCell>
                <TableCell>{op.operatorInfo?.phone || '-'}</TableCell>
                <TableCell><Badge variant={op.operatorInfo?.active ? 'success' : 'secondary'}>{op.operatorInfo?.active ? 'Activo' : 'Inactivo'}</Badge></TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => toggleActive(op.id, op.operatorInfo?.active)}><Power className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
