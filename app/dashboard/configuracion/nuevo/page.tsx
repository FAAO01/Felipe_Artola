"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function NuevoRolPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    nombre_rol: "",
    descripcion: "",
    nivel_acceso: "1",
    funciones: [] as string[],
  })

  const [mensaje, setMensaje] = useState("")
  const [guardando, setGuardando] = useState(false)

  const todasLasFunciones = [
    "dashboard",
    "proveedores",
    "categoria",
    "productos",
    "clientes",
    "ventas",
    "copia de seguridad",
    "reportes",
    "usuarios",
    "configuracion",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleToggleFuncion = (funcion: string) => {
    setForm((prev) => ({
      ...prev,
      funciones: prev.funciones.includes(funcion)
        ? prev.funciones.filter((f) => f !== funcion)
        : [...prev.funciones, funcion],
    }))
  }

  const handleSubmit = async () => {
    setGuardando(true)
    setMensaje("")

    if (!form.nombre_rol.trim()) {
      setMensaje("⚠️ El nombre del rol es obligatorio.")
      setGuardando(false)
      return
    }

    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_rol: form.nombre_rol,
          descripcion: form.descripcion,
          nivel_acceso: Number(form.nivel_acceso),
          funciones: form.funciones,
        }),
      })

      if (!res.ok) throw new Error("Error al registrar el rol")

      setMensaje("✅ Rol creado correctamente")
      setTimeout(() => router.push("/dashboard/configuracion"), 1200)
    } catch (err) {
      console.error(err)
      setMensaje("❌ Error al guardar el rol")
    } finally {
      setGuardando(false)
    }
  }

  const handleCancelar = () => {
    router.push("/dashboard/configuracion")
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Rol</CardTitle>
          <p className="text-sm text-muted-foreground">
            Completá los campos y asigná las funciones que tendrá este rol.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre del rol</Label>
            <Input
              name="nombre_rol"
              value={form.nombre_rol}
              onChange={handleChange}
              placeholder="Ej: Supervisor"
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Detalle breve sobre las funciones del rol"
            />
          </div>

          <div>
            <Label>Nivel de acceso</Label>
            <Input
              name="nivel_acceso"
              type="number"
              value={form.nivel_acceso}
              onChange={handleChange}
              min={1}
              max={3}
              placeholder="1, 2 o 3"
            />
          </div>

          <div>
            <Label>Funciones asignadas</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {todasLasFunciones.map((funcion) => (
                <label key={funcion} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.funciones.includes(funcion)}
                    onCheckedChange={() => handleToggleFuncion(funcion)}
                  />
                  {funcion.charAt(0).toUpperCase() + funcion.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {mensaje && <p className="text-sm text-muted-foreground">{mensaje}</p>}

          <div className="mt-4 space-y-2">
            <Button
              className="black-500 hover:black-600 w-full text-white"
              onClick={handleSubmit}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar Rol"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCancelar}
              type="button"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
