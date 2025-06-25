"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button.tsx"
import { Truck, Mail, Phone, MapPin, ArrowLeft, Pencil } from "lucide-react"

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
  // Asegura que id siempre sea string
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        if (!id) {
          setError("ID de proveedor no especificado")
          setLoading(false)
          return
        }
        const res = await fetch(`/api/proveedores/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Proveedor no encontrado")
        setProveedor(data.proveedor)
      } catch (err: any) {
        setError(err.message)
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
      <div className="text-center py-10">
        <p className="text-red-600">{error || "Proveedor no encontrado"}</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/proveedores")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-orange-600" />
            <span className="text-lg font-semibold">{proveedor.nombre}</span>
            <Badge variant={proveedor.estado === "inactivo" ? "destructive" : "secondary"}>
              {proveedor.estado}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            {proveedor.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            {proveedor.telefono}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            {proveedor.direccion}
          </p>
          <p className="font-semibold">
            RUC: <span className="font-normal">{proveedor.ruc}</span>
          </p>
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => router.push("/dashboard/proveedores")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={() => router.push(`/dashboard/proveedores/${proveedor.id_proveedor}/editar`)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}