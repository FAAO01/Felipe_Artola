"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function NuevoClientePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipo_documento: "",
    numero_documento: "",
    email: "",
    telefono: "",
    direccion: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al crear cliente")

      setSuccess("Cliente registrado exitosamente")
      setTimeout(() => router.push("/dashboard/clientes"), 1000)
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input name="apellido" value={form.apellido} onChange={handleChange} required />
            </div>
            <div>
              <Label>Tipo de Documento</Label>
              <select
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccione</option>
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>
            <div>
              <Label>Número de Documento</Label>
              <Input name="numero_documento" value={form.numero_documento} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Label>Dirección</Label>
              <Input name="direccion" value={form.direccion} onChange={handleChange} />
            </div>

            {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
            {success && <p className="col-span-2 text-sm text-green-600">{success}</p>}

            <div className="col-span-2 flex flex-col gap-3 mt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Guardando..." : "Registrar Cliente"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/dashboard/clientes")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
