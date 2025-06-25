"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function NuevoProductoPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: "",
    codigo_barras: "",
    precio_venta: "",
    stock: "",
    stock_minimo: "",
    categoria_id: "",
    proveedor_id: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoria_id: parseInt(form.categoria_id),
          proveedor_id: parseInt(form.proveedor_id),
          precio_venta: parseFloat(form.precio_venta),
          stock: parseInt(form.stock),
          stock_minimo: parseInt(form.stock_minimo),
        }),
      })
      if (!res.ok) throw new Error("Error al crear producto")
      router.push("/dashboard/productos")
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const [categorias, setCategorias] = useState<{ id_categoria: number; nombre: string }[]>([])
  const [proveedores, setProveedores] = useState<{ id_proveedor: number; nombre: string }[]>([])

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/categorias")
        const data = await res.json()
        setCategorias(Array.isArray(data.categorias) ? data.categorias : [])
      } catch {
        setCategorias([])
      }
    }

    const fetchProveedores = async () => {
      try {
        const res = await fetch("/api/proveedores")
        const data = await res.json()
        setProveedores(Array.isArray(data.proveedores) ? data.proveedores : [])
      } catch {
        setProveedores([])
      }
    }

    fetchCategorias()
    fetchProveedores()
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
            <Input name="codigo_barras" placeholder="Código de barras" value={form.codigo_barras} onChange={handleChange} required />
            <Input name="precio_venta" placeholder="Precio de venta" type="number" step="0.01" value={form.precio_venta} onChange={handleChange} required />
            <Input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required />
            <Input name="stock_minimo" placeholder="Stock mínimo" type="number" value={form.stock_minimo} onChange={handleChange} required />

            <select name="categoria_id" value={form.categoria_id} onChange={handleChange} required className="w-full border rounded px-3 py-2">
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            <select name="proveedor_id" value={form.proveedor_id} onChange={handleChange} required className="w-full border rounded px-3 py-2">
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id_proveedor} value={prov.id_proveedor}>
                  {prov.nombre}
                </option>
              ))}
            </select>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Producto"}
            </Button>
            <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => router.push("/dashboard/productos")}>
              Cancelar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
