"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function NuevoUsuarioPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", usuario: "",
    contrasena: "", telefono: "", direccion: "", id_rol: 1
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      toast.success("✅ Usuario creado.")
      router.push("/dashboard/usuarios")
    } catch {
      toast.error("❌ Error al registrar usuario.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar nuevo usuario</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["nombre", "apellido", "email", "usuario", "contrasena", "telefono"].map((field) => (
            <div key={field}>
              <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input name={field} type={field === "contrasena" ? "password" : "text"} value={(form as any)[field]} onChange={handleChange} />
            </div>
          ))}
          <div className="md:col-span-2">
            <Label>Dirección</Label>
            <Input name="direccion" value={form.direccion} onChange={handleChange} />
          </div>
          
          <Button className="md:col-span-2 mt-4" disabled={loading} onClick={handleSubmit}>
            {loading ? "Guardando..." : "Registrar usuario"}
          </Button>
          
          <Button
            variant="outline"
            className="md:col-span-2"
            onClick={() => router.push("/dashboard/usuarios")}
          >
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
