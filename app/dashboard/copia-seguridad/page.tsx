"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { DatabaseBackup, Download, Upload } from "lucide-react"

export default function BackupPage() {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingRestore, setLoadingRestore] = useState(false)
  const [statusRestore, setStatusRestore] = useState("")

  const descargarBackup = async () => {
    try {
      setLoading(true)
      setStatus("Generando backup...")

      const res = await fetch("/api/backup", {
        method: "GET",
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

  const importarBackup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fileInput = e.currentTarget.sqlFile as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (!file) return setStatusRestore("Debe seleccionar un archivo .sql")

    const formData = new FormData()
    formData.append("sqlFile", file)

    setLoadingRestore(true)
    setStatusRestore("Importando base de datos...")

    try {
      const res = await fetch("/api/backup/importar", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al importar")

      setStatusRestore("Base de datos restaurada correctamente.")
    } catch (err) {
      console.error("Error al restaurar:", err)
      setStatusRestore("Ocurrió un error al restaurar la base.")
    } finally {
      setLoadingRestore(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-8">

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex gap-2 items-center">
            <DatabaseBackup className="h-6 w-6 text-blue-600" />
            Descargar Backup del sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            ¿Desea realizar un Backup de su sistema?
          </p>
          <Button onClick={descargarBackup} disabled={loading} className="w-full">
            <Download className="w-5 h-5 mr-2" />
            {loading ? "Generando..." : "Descargar Backup"}
          </Button>
          {status && <p className="text-sm text-muted-foreground text-center">{status}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex gap-2 items-center">
            <Upload className="h-6 w-6 text-green-600" />
            Restaurar Backup del sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            ¿Tiene un archivo .sql y desea restaurar su sistema?
          </p>
          <form onSubmit={importarBackup} className="space-y-3">
            <input
              name="sqlFile"
              type="file"
              accept=".sql"
              required
              className="w-full border rounded px-3 py-2"
            />
            <Button type="submit" disabled={loadingRestore} className="w-full">
              <Upload className="w-5 h-5 mr-2" />
              {loadingRestore ? "Restaurando..." : "Restaurar Backup"}
            </Button>
          </form>
          {statusRestore && <p className="text-sm text-muted-foreground text-center">{statusRestore}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
