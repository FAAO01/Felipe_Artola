"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

export default function VerProductoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [producto, setProducto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`/api/productos/${id}`)
        if (!res.ok) throw new Error("No se pudo cargar el producto")
        const data = await res.json()
        setProducto(data.producto)
      } catch (err: any) {
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProducto()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando producto...</div>
  }

  if (error || !producto) {
    return <div className="text-center text-red-600 py-10">{error || "Producto no encontrado"}</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Detalle del Producto</CardTitle>
          <Badge variant={producto.stock <= producto.stock_minimo ? "destructive" : "secondary"}>
            {producto.estado}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{producto.nombre}</h2>
              <p className="text-sm text-gray-500">Código de barras: {producto.codigo_barras}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Precio de venta:</span><br />
              C$ {Number(producto.precio_venta).toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Stock actual:</span><br />
              {producto.stock}
            </div>
            <div>
              <span className="font-medium">Stock mínimo:</span><br />
              {producto.stock_minimo}
            </div>
            <div>
              <span className="font-medium">Categoría:</span><br />
              {producto.categoria_nombre || "Sin categoría"}
            </div>
            <div>
              <span className="font-medium">Proveedor:</span><br />
              {producto.proveedor_nombre || "Sin proveedor"}
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-6" onClick={() => router.push("/dashboard/productos")}>
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

