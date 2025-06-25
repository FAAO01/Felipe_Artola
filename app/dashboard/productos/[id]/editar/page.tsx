"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function EditarProductoPage() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    nombre: "",
    codigo_barras: "",
    precio_venta: "",
    stock: "",
    stock_minimo: "",
    descripcion: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`/api/productos/${id}`)
        if (!res.ok) throw new Error("No se pudo obtener el producto")
        const data = await res.json()
        const p = data.producto
        setForm({
          nombre: p.nombre || "",
          codigo_barras: p.codigo_barras || "",
          precio_venta: String(p.precio_venta || ""),
          stock: String(p.stock || ""),
          stock_minimo: String(p.stock_minimo || ""),
          descripcion: p.descripcion || "",
        })
      } catch (err: any) {
        setError(err.message || "Error al cargar el producto")
      } finally {
        setCargandoDatos(false)
      }
    }

    if (id) fetchProducto()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Error al actualizar el producto")
      router.push("/dashboard/productos")
    } catch (err: any) {
      setError(err.message || "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  if (cargandoDatos) {
    return <div className="text-center py-10">Cargando producto...</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
            <Input name="codigo_barras" value={form.codigo_barras} onChange={handleChange} placeholder="Código de Barras" required />
            <Input name="precio_venta" value={form.precio_venta} onChange={handleChange} placeholder="Precio de venta" type="number" required />
            <Input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock actual" type="number" required />
            <Input name="stock_minimo" value={form.stock_minimo} onChange={handleChange} placeholder="Stock mínimo" type="number" required />
            <Input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción (opcional)" />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => router.push("/dashboard/productos")}>
              Cancelar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
