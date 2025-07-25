"use client"
// import { handleImprimirVenta } from "@/utils/imprimirVenta" 

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
  porcentaje_impuesto: number
  subtotal: number
  impuesto: number
  total: number
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
        console.log("✅ Venta recibida:", data.venta)
        setVenta(data.venta)
      } catch (err) {
        console.error("❌ Error al obtener venta:", err)
      }
    }

    if (id) fetchVenta()
  }, [id])

  // Logs defensivos para validación fiscal
  useEffect(() => {
    if (venta) {
      console.log("ℹ️ Porcentaje de impuesto:", venta.porcentaje_impuesto)
      console.log("ℹ️ Subtotal recibido:", venta.subtotal)
      console.log("ℹ️ Impuesto calculado en backend:", venta.impuesto)
      console.log("ℹ️ Total registrado:", venta.total)

      const missing: string[] = []
      if (venta.subtotal == null) missing.push("subtotal")
      if (venta.impuesto == null) missing.push("impuesto")
      if (venta.total == null) missing.push("total")
      if (venta.porcentaje_impuesto == null) missing.push("porcentaje_impuesto")
      if (missing.length > 0) {
        console.warn("⚠️ Campos fiscales faltantes:", missing)
      } else {
        console.log("✅ Todos los campos fiscales están presentes.")
      }

      const tipos = {
        subtotal: typeof venta.subtotal,
        impuesto: typeof venta.impuesto,
        total: typeof venta.total,
        porcentaje_impuesto: typeof venta.porcentaje_impuesto,
      }
      console.log("🔍 Tipos de campos fiscales:", tipos)

      const valoresNum = Object.entries(tipos).filter(([_, t]) => t !== "number")
      if (valoresNum.length > 0) {
        console.error("❌ Campos fiscales inválidos (no numéricos):", valoresNum)
      }
    }
  }, [venta])

  const mostrar = (valor: number | string | null | undefined) =>
    new Intl.NumberFormat("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor ?? 0))

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
              <p>{venta.cliente}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fecha</Label>
              <p>{new Date(venta.fecha).toLocaleString("es-NI")}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Método de pago</Label>
              <p className="capitalize">
                {venta.metodo_pago === "Efectivo" && "Efectivo"}
                {venta.metodo_pago === "Tarjeta" && "Tarjeta"}
                {venta.metodo_pago === "Transferencia bancaria" && "Transferencia bancaria"}
                {venta.metodo_pago === "Crédito" && "Crédito"}
                {!["Efectivo", "Tarjeta", "Transferencia", "Credito"].includes(venta.metodo_pago) &&
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
            <p>Subtotal: C${mostrar(venta.subtotal)}</p>
            <p>Impuesto ({venta.porcentaje_impuesto}%): C${mostrar(venta.impuesto)}</p>
            <p className="text-lg text-black dark:text-white font-bold">
              Total: C${mostrar(venta.total)}
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