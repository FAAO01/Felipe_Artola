"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { DatabaseBackup, Download } from "lucide-react"

export default function BackupPage() {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const descargarBackup = async () => {
    try {
      setLoading(true)
      setStatus("Generando backup...")

      const res = await fetch("/api/backup", {
        method: "GET"
      })

      if (!res.ok) throw new Error("No se pudo generar el backup.")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "backup.zip"
      a.click()
      window.URL.revokeObjectURL(url)

      setStatus("Backup descargado correctamente.")
    } catch (err) {
      console.error("Error descargando backup:", err)
      setStatus("Error al descargar backup.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex gap-2 items-center">
            <DatabaseBackup className="h-6 w-6 text-blue-600" />
            Backup del sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
          <center>¿Desea realizar un Backup de su sistema?</center>
          </p>
          <Button onClick={descargarBackup} disabled={loading} className="w-full">
            <Download className="w-5 h-5 mr-2" />
            {loading ? "Generando..." : "Descargar Backup"}
          </Button>
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
