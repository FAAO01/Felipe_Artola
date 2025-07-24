"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, FileText } from "lucide-react"

interface Cliente {
  id_cliente: number
  nombre: string
  apellido: string
  tipo_documento: string
  numero_documento: string
  email: string
  telefono: string
  direccion: string
}

export default function VerClientePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string | undefined

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`/api/clientes/${id}`)
        if (!res.ok) throw new Error("No se pudo cargar el cliente")
        const data = await res.json()
        setCliente(data.cliente)
      } catch (err: any) {
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCliente()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando datos del cliente...</div>
  }

  if (error || !cliente) {
    return <div className="text-center text-red-600 py-10">{error || "Cliente no encontrado"}</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Detalle del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {cliente.nombre} {cliente.apellido}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {cliente.tipo_documento} {cliente.numero_documento}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              {cliente.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              {cliente.telefono}
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              {cliente.direccion}
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-6" onClick={() => router.push("/dashboard/clientes")}>
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

