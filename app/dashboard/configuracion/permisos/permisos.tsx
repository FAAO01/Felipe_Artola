"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function FuncionalidadesPage() {
  const router = useRouter()

  const [rolSeleccionado, setRolSeleccionado] = useState("")
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")

  const rolesDisponibles = ["Administrador", "Supervisor", "Vendedor"]
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

  const toggleFuncion = (funcion: string) => {
    setSeleccionadas((prev) =>
      prev.includes(funcion)
        ? prev.filter((f) => f !== funcion)
        : [...prev, funcion]
    )
  }

  const handleGuardar = async () => {
    if (!rolSeleccionado) {
      setMensaje("⚠️ Seleccioná un rol antes de guardar.")
      return
    }

    setGuardando(true)
    setMensaje("")

    try {
      const res = await fetch("/api/roles/funciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rol: rolSeleccionado,
          funciones: seleccionadas,
        }),
      })

      if (!res.ok) throw new Error("Error al asignar funciones")

      setMensaje("✅ Funciones asignadas correctamente")
      setTimeout(() => router.push("/dashboard/configuracion"), 1500)
    } catch (err) {
      console.error(err)
      setMensaje("❌ Error al asignar funciones")
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
          <CardTitle>Asignar Funcionalidades a un Rol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Seleccionar rol</Label>
            <Select onValueChange={setRolSeleccionado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccioná un rol" />
              </SelectTrigger>
              <SelectContent>
                {rolesDisponibles.map((rol) => (
                  <SelectItem key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {rolSeleccionado && (
            <>
              <Label>Funciones disponibles para <strong>{rolSeleccionado}</strong></Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {todasLasFunciones.map((funcion) => (
                  <label key={funcion} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={seleccionadas.includes(funcion)}
                      onCheckedChange={() => toggleFuncion(funcion)}
                    />
                    {funcion.charAt(0).toUpperCase() + funcion.slice(1)}
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  className="black-500 hover:black-600 w-full text-white"
                  onClick={handleGuardar}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar Funciones"}
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

          {mensaje && (
            <div className="mt-2 text-sm text-muted-foreground">
              {mensaje}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}