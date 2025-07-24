"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Mail, Phone, MapPin } from "lucide-react"

interface Proveedor {
  id_proveedor: number
  nombre: string
  ruc: string
  telefono: string
  email: string
  direccion: string
  estado: string
}

export default function DetallesProveedorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string | undefined

  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const res = await fetch(`/api/proveedores/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Proveedor no encontrado")
        setProveedor(data.proveedor)
      } catch (err: any) {
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProveedor()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando proveedor...</div>
  }

  if (error || !proveedor) {
    return (
      <div className="text-center text-red-600 py-10">
        {error || "Proveedor no encontrado"}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Detalle del Proveedor</CardTitle>
          <Badge variant={proveedor.estado === "inactivo" ? "destructive" : "secondary"}>
            {proveedor.estado}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{proveedor.nombre}</h2>
              <p className="text-sm text-gray-500">RUC: {proveedor.ruc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-gray-400" />
              {proveedor.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-gray-400" />
              {proveedor.telefono}
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              {proveedor.direccion}
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-6" onClick={() => router.push("/dashboard/proveedores")}>
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
