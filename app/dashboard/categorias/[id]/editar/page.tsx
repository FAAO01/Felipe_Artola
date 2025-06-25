"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditarCategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cargandoDatos, setCargandoDatos] = useState(true)

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await fetch(`/api/categorias/${id}`)
        if (!res.ok) throw new Error("No se pudo cargar la categoría")
        const data = await res.json()
        setForm({
          nombre: data.categoria.nombre || "",
          descripcion: data.categoria.descripcion || "",
          estado: data.categoria.estado || "activo"
        })
      } catch (err: any) {
        setError(err.message || "Error desconocido")
      } finally {
        setCargandoDatos(false)
      }
    }
    if (id) fetchCategoria()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Error al actualizar categoría")
      router.push("/dashboard/categorias")
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (cargandoDatos) {
    return <div className="text-center py-10">Cargando datos de la categoría...</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nombre" placeholder="Nombre de la categoría" value={form.nombre} onChange={handleChange} required />
            <Input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
            <select name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => router.push("/dashboard/categorias")}>Cancelar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
