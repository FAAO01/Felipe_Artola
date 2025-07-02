"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarRolPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const router = useRouter()

  const [form, setForm] = useState({
    nombre_rol: "",
    descripcion: "",
    nivel_acceso: "1",
    funciones: [] as string[],
  })

  const [mensaje, setMensaje] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)

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

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const res = await fetch(`/api/roles/${id}`)
        const data = await res.json()

        if (data.success) {
          setForm({
            nombre_rol: data.rol.nombre_rol,
            descripcion: data.rol.descripcion || "",
            nivel_acceso: String(data.rol.nivel_acceso),
            funciones: (data.rol.funciones || "").split(",").map((f: string) => f.trim()),
          })
        } else {
          setMensaje("⚠️ No se pudo cargar el rol.")
        }
      } catch (error) {
        console.error(error)
        setMensaje("❌ Error al obtener los datos del rol.")
      } finally {
        setCargando(false)
      }
    }

    fetchRol()
  }, [id])

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
      const res = await fetch(`/api/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_rol: form.nombre_rol,
          descripcion: form.descripcion,
          nivel_acceso: Number(form.nivel_acceso),
          funciones: form.funciones,
        }),
      })

      if (!res.ok) throw new Error("Error al actualizar el rol")

      setMensaje("Rol actualizado correctamente")
      setTimeout(() => router.push("/dashboard/configuracion"), 1200)
    } catch (error) {
      console.error(error)
      setMensaje("Error al guardar los cambios")
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
          <CardTitle>Editar Rol</CardTitle>
          <p className="text-sm text-muted-foreground">
            Modificá los datos y permisos asignados a este rol.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {cargando ? (
            <p className="text-sm text-muted-foreground">Cargando datos del rol...</p>
          ) : (
            <>
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
                  {guardando ? "Guardando..." : "Guardar Cambios"}
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
