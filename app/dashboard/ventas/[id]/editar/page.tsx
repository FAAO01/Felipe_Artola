"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function EditarVentaPage() {
  const { id } = useParams()
  const router = useRouter()

  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState({
    id_cliente: "",
    metodo_pago: "",
    fecha_venta: "",
    total: 0,
  })

  useEffect(() => {
    const cargarVenta = async () => {
      try {
        const res = await fetch(`/api/ventas/${id}`)
        const data = await res.json()

        if (res.ok && data) {
          setForm({
            id_cliente: data.id_cliente || "",
            metodo_pago: data.metodo_pago || "",
            fecha_venta: data.fecha_venta?.slice(0, 10) || "",
            total: data.total || 0,
          })
        } else {
          toast.warning("No se encontró la venta")
          router.push("/dashboard/ventas")
        }
      } catch (error) {
        toast.error("Error al cargar la venta")
        console.error(error)
      } finally {
        setCargando(false)
      }
    }

    if (id) cargarVenta()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const actualizarVenta = async () => {
    try {
      const res = await fetch(`/api/ventas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success("Venta actualizada correctamente")
      router.push("/dashboard/ventas")
    } catch (error) {
      toast.error("Error al actualizar venta")
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Venta #{id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cargando ? (
            <p className="text-muted-foreground text-sm">Cargando datos de la venta...</p>
          ) : (
            <>
              <div>
                <Label>ID Cliente</Label>
                <Input name="id_cliente" value={form.id_cliente} onChange={handleChange} />
              </div>
              <div>
                <Label>Método de pago</Label>
                <Input name="metodo_pago" value={form.metodo_pago} onChange={handleChange} />
              </div>
              <div>
                <Label>Fecha de venta</Label>
                <Input type="date" name="fecha_venta" value={form.fecha_venta} onChange={handleChange} />
              </div>
              <div>
                <Label>Total</Label>
                <Input name="total" value={form.total} disabled />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={actualizarVenta}>Guardar Cambios</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/dashboard/ventas")}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
