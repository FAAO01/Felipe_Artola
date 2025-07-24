"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string
  estado: string
}

export default function VerCategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await fetch(`/api/categorias/${id}`)
        if (!res.ok) throw new Error("No se pudo cargar la categoría")
        const data = await res.json()
        if (data && data.categoria) {
          setCategoria(data.categoria)
        } else {
          throw new Error("Categoría no encontrada")
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCategoria()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando categoría...</div>
  }

  if (error || !categoria) {
    return <div className="text-center text-red-600 py-10">{error || "Categoría no encontrada"}</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Detalle de la Categoría</CardTitle>
          <Badge variant={categoria.estado === "inactivo" ? "destructive" : "secondary"}>
            {categoria.estado}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{categoria.nombre}</h2>
              <p className="text-sm text-gray-500">ID: {categoria.id_categoria}</p>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            <span className="font-medium">Descripción:</span>
            <p className="mt-1">{categoria.descripcion || "Sin descripción"}</p>
          </div>

          <Button variant="secondary" className="w-full mt-6" onClick={() => router.push("/dashboard/categorias")}>
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

