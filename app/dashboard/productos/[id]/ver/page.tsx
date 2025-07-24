"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string
  estado: string
}

export default function VerCategoriaPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await fetch(`/api/categorias/${params.id}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (data && data.categoria) {
          setCategoria(data.categoria)
        } else {
          setError("No se encontró la categoría.")
        }
      } catch {
        setError("Error al cargar la categoría.")
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchCategoria()
  }, [params.id])

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle><center>Detalle de Categoría</center></CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : categoria ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{categoria.nombre}</h2>
                  <Badge variant={categoria.estado === "inactivo" ? "destructive" : "secondary"}>
                    {categoria.estado}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Descripción</h3>
                <p className="text-gray-700">{categoria.descripcion}</p>
              </div>
            </div>
          ) : null}
          <Button className="mt-8" variant="outline" onClick={() => router.push("/dashboard/categorias")}>Volver</Button>
        </CardContent>
      </Card>
    </div>
  )
}
