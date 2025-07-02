"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function General() {
  const [config, setConfig] = useState({
    nombre_negocio: "",
    moneda: "",
    impuesto: "",
  })

  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const res = await fetch("/api/configuracion")
        const data = await res.json()
        setConfig(data)
      } catch (error) {
        console.error("Error al cargar configuración:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarConfiguracion()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value })
  }

  const guardarConfiguracion = async () => {
    setMensaje("")
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!res.ok) throw new Error("Error en la solicitud")

      setMensaje("Configuración guardada correctamente")
    } catch (error) {
      console.error("Error al guardar:", error)
      setMensaje("Ocurrió un error al guardar la configuración")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General del Sistema</CardTitle>
        <p className="text-sm text-muted-foreground">
          Actualizá la información básica del negocio y los parámetros globales.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {cargando ? (
          <p className="text-sm text-muted-foreground">Cargando configuración...</p>
        ) : (
          <>
            <div>
              <Label>Nombre del negocio</Label>
              <Input
                name="nombre_negocio"
                value={config.nombre_negocio}
                onChange={handleChange}
                placeholder="Ej: Ferretería El Tornillo"
              />
            </div>

            <div>
              <Label>Moneda</Label>
              <Input
                name="moneda"
                value={config.moneda}
                onChange={handleChange}
                placeholder="Ej: C$"
              />
            </div>

            <div>
              <Label>Porcentaje de impuesto</Label>
              <Input
                name="impuesto"
                type="number"
                value={config.impuesto}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            {mensaje && <p className="text-sm text-muted-foreground">{mensaje}</p>}

            <Button className="mt-4 w-full" onClick={guardarConfiguracion}>
              <Save className="w-4 h-4 mr-2" />
              Guardar configuración
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
