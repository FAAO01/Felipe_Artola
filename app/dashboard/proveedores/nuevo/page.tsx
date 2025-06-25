"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NuevoProveedorPage() {
  const router = useRouter()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Error al crear proveedor")
      router.push("/dashboard/proveedores")
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
            <Input name="ruc" placeholder="RUC" value={form.ruc} onChange={handleChange} required />
            <Input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
            <Input name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required type="email" />
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
              {loading ? "Guardando..." : "Guardar Proveedor"}
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
