"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FileText, ShoppingCart } from "lucide-react"

interface ProductoVenta {
  id_producto: number
  producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface VentaDetalle {
  id_venta: number
  id_cliente: number
  cliente: string
  fecha: string
  metodo_pago: string
  productos: ProductoVenta[]
}

export default function VerDetalleVentaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined

  const [venta, setVenta] = useState<VentaDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const res = await fetch(`/api/ventas/${id}`)
        const data = await res.json()
        if (!res.ok || !data.venta) throw new Error("Venta no encontrada")
        setVenta(data.venta)
      } catch (err: any) {
        setError(err.message || "Error al obtener venta")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchVenta()
  }, [id])

  const mostrar = (valor: number | string | null | undefined) =>
    new Intl.NumberFormat("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor ?? 0))

  if (loading) {
    return <div className="text-center py-10">Cargando venta...</div>
  }

  if (error || !venta) {
    return <div className="text-center text-red-600 py-10">{error || "Venta no encontrada"}</div>
  }

  const subtotal = venta.productos.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  )
  const impuesto = subtotal * 0.18
  const total = subtotal + impuesto

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Detalle de la Venta</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Factura {venta.id_venta}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {new Date(venta.fecha).toLocaleString("es-NI")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <Label className="text-muted-foreground">Cliente</Label>
              <p>{venta.cliente}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Método de pago</Label>
              <p className="capitalize">
                {{
                  efectivo: "Efectivo",
                  tarjeta: "Tarjeta",
                  transferencia: "Transferencia bancaria",
                  credito: "Crédito"
                }[venta.metodo_pago] ?? venta.metodo_pago}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Productos</Label>
            <div className="mt-2 rounded-md border divide-y">
              {venta.productos.map((prod, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-2 text-sm">
                  <div>
                    <p className="font-medium">{prod.producto}</p>
                    <p className="text-muted-foreground">
                      {prod.cantidad} x C${mostrar(prod.precio_unitario)}
                    </p>
                  </div>
                  <span className="font-semibold text-right">
                    C${mostrar(prod.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right text-muted-foreground space-y-1 border-t pt-4">
            <p>Subtotal: C${mostrar(subtotal)}</p>
            <p>Impuesto (18%): C${mostrar(impuesto)}</p>
            <p className="text-lg text-black dark:text-white font-bold">
              Total: C${mostrar(total)}
            </p>
          </div>

          <Button variant="secondary" className="w-full mt-6" onClick={() => router.push("/dashboard/ventas")}>
            Volver al listado
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

