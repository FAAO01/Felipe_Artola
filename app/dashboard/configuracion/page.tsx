"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    nombre_negocio: "",
    moneda: "",
    impuesto: "",
  })
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const res = await fetch("/api/configuracion")
        const data = await res.json()
        setConfig(data)
      } catch (error) {
        console.error("Error cargando configuración:", error)
      }
    }

    cargarConfiguracion()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value })
  }

  const guardarCambios = async () => {
    setMensaje("")
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!res.ok) throw new Error("Error al guardar configuración")

      setMensaje("✅ Configuración guardada con éxito")
    } catch (error) {
      console.error(error)
      setMensaje("Ocurrió un error al guardar")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre del negocio</Label>
            <Input name="nombre_negocio" value={config.nombre_negocio} onChange={handleChange} />
          </div>

          <div>
            <Label>Moneda</Label>
            <Input name="moneda" value={config.moneda} onChange={handleChange} placeholder="Ej: C$ o $" />
          </div>

          <div>
            <Label>Porcentaje de impuesto</Label>
            <Input name="impuesto" type="number" value={config.impuesto} onChange={handleChange} />
          </div>

          {mensaje && <p className="text-sm text-muted-foreground">{mensaje}</p>}

          <Button className="w-full mt-4" onClick={guardarCambios}>
            <Save className="w-4 h-4 mr-2" />
            Guardar configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
