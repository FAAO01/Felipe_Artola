"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditarProveedorPage() {
  const router = useRouter()
  const { id } = useParams()as { id: string }
  const [form, setForm] = useState({
    nombre: "",
    ruc: "",
    telefono: "",
    email: "",
    direccion: "",
    estado: "activo",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cargandoDatos, setCargandoDatos] = useState(true)

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const res = await fetch(`/api/proveedores/${id}`)
        if (!res.ok) throw new Error("No se pudo obtener el proveedor")
        const data = await res.json()
        const p = data.proveedor
        setForm({
          nombre: p.nombre || "",
          ruc: p.ruc || "",
          telefono: p.telefono || "",
          email: p.email || "",
          direccion: p.direccion || "",
          estado: p.estado || "activo",
        })
      } catch (err: any) {
        setError(err.message || "Error al cargar")
      } finally {
        setCargandoDatos(false)
      }
    }

    if (id) fetchProveedor()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/proveedores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Error al actualizar proveedor")
      router.push("/dashboard/proveedores")
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (cargandoDatos) {
    return <div className="text-center py-10">Cargando proveedor...</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
            <Input name="ruc" placeholder="RUC" value={form.ruc} onChange={handleChange} required />
            <Input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
            <Input name="email" placeholder="Correo electrónico" type="email" value={form.email} onChange={handleChange} required />
            <Input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => router.push("/dashboard/proveedores")}>
              Cancelar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
