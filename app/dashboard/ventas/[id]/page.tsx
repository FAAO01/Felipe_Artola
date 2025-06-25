"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ProductoVenta {
  id_producto: number
  cantidad: number
  precio_unitario: number
}

interface VentaDetalle {
  id_venta: number
  id_cliente: number
  cliente_nombre: string
  cliente_apellido: string
  fecha_venta: string
  metodo_pago: string
  id_transferencia?: string
  ultimos4?: string
  monto_recibido?: number
  nota?: string
  subtotal: number | string | null
  impuesto: number | string | null
  total: number | string | null
  productos: ProductoVenta[]
}

export default function VerDetalleVentaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [venta, setVenta] = useState<VentaDetalle | null>(null)

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const res = await fetch(`/api/ventas/${id}`)
        const data = await res.json()
        setVenta(data.venta)
      } catch (err) {
        console.error("Error al obtener venta:", err)
      }
    }

    fetchVenta()
  }, [id])

  const mostrarMonto = (valor: number | string | null | undefined) =>
    Number(valor ?? 0).toFixed(2)

  if (!venta) return <p className="p-6 text-gray-500">Cargando venta...</p>

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Venta #{venta.id_venta}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <section className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Cliente</Label>
              <p>{venta.cliente_nombre} {venta.cliente_apellido}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fecha</Label>
              <p>{new Date(venta.fecha_venta).toLocaleString("es-NI")}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Método de pago</Label>
              <p className="capitalize">{venta.metodo_pago}</p>

              {venta.metodo_pago === "efectivo" && (
                <p>
                  <span className="font-semibold">Monto recibido:</span>{" "}
                  {venta.monto_recibido != null
                    ? `C$${mostrarMonto(venta.monto_recibido)}`
                    : <em className="text-muted-foreground">No registrado</em>}
                </p>
              )}

              {venta.metodo_pago === "transferencia" && (
                <p>
                  <span className="font-semibold">ID de Transferencia:</span>{" "}
                  {venta.id_transferencia || <em className="text-muted-foreground">No disponible</em>}
                </p>
              )}

              {venta.metodo_pago === "tarjeta" && (
                <p>
                  <span className="font-semibold">Últimos 4 dígitos:</span>{" "}
                  {venta.ultimos4 || <em className="text-muted-foreground">No disponible</em>}
                </p>
              )}

              {venta.metodo_pago === "credito" && venta.nota && (
                <p>
                  <span className="font-semibold">Nota:</span> {venta.nota}
                </p>
              )}
            </div>
          </section>

          <section>
            <Label className="text-muted-foreground">Productos</Label>
            <div className="mt-2 rounded-md border divide-y">
              {venta.productos.map((prod, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">Producto #{prod.id_producto}</p>
                    <p className="text-muted-foreground">
                      {prod.cantidad} x C${mostrarMonto(prod.precio_unitario)}
                    </p>
                  </div>
                  <span className="font-semibold text-right">
                    C${mostrarMonto(prod.precio_unitario * prod.cantidad)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="text-sm text-right text-muted-foreground space-y-1 border-t pt-4">
            <p>Subtotal: C${mostrarMonto(venta.subtotal)}</p>
            <p>Impuesto (18%): C${mostrarMonto(venta.impuesto)}</p>
            <p className="text-lg text-black dark:text-white font-bold">
              Total: C${mostrarMonto(venta.total)}
            </p>
          </section>

          <div className="pt-4">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => router.push("/dashboard/ventas")}
            >
              Volver al listado
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
