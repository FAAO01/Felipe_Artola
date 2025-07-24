"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
  const [venta, setVenta] = useState<VentaDetalle | null>(null)
  const id = params?.id?.toString() ?? ""

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

  if (!venta) return <p className="p-6 text-gray-500">Cargando venta...</p>

  const subtotal = venta.productos.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  )
  const impuesto = subtotal * 0.18
  const total = subtotal + impuesto

  const mostrar = (valor: number | string | null | undefined) =>
    new Intl.NumberFormat("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor ?? 0))

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Factura {venta.id_venta}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <section className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Cliente</Label>
              <p>{venta.cliente}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fecha</Label>
              <p>{new Date(venta.fecha).toLocaleString("es-NI")}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Método de pago</Label>
              <p className="capitalize">
                {venta.metodo_pago === "efectivo" && "Efectivo"}
                {venta.metodo_pago === "tarjeta" && "Tarjeta"}
                {venta.metodo_pago === "transferencia" && "Transferencia bancaria"}
                {venta.metodo_pago === "credito" && "Crédito"}
                {!["efectivo", "tarjeta", "transferencia", "credito"].includes(venta.metodo_pago) &&
                  venta.metodo_pago}
              </p>
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
          </section>

          <section className="text-sm text-right text-muted-foreground space-y-1 border-t pt-4">
            <p>Subtotal: C${mostrar(subtotal)}</p>
            <p>Impuesto (18%): C${mostrar(impuesto)}</p>
            <p className="text-lg text-black dark:text-white font-bold">
              Total: C${mostrar(total)}
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
