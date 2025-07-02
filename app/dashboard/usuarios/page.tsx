"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Usuario {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  usuario: string
  estado: string
  rol: string
}

export default function UsuariosPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await fetch("/api/usuarios")
        const data = await res.json()
        setUsuarios(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al obtener usuarios:", error)
      }
    }

    obtenerUsuarios()
  }, [])

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.apellido.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.usuario.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestión de usuarios registrados en el sistema
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/dashboard/usuarios/nuevo")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, usuario o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>

        <CardContent>
          {usuariosFiltrados.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No se encontraron usuarios.
            </p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {usuariosFiltrados.map((u) => (
                <Card key={u.id_usuario} className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-lg">
                      {u.nombre} {u.apellido}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground p-0">
                    <p><strong>Correo:</strong> {u.email}</p>
                    <p><strong>Usuario:</strong> {u.usuario}</p>
                    <p><strong>Rol:</strong> {u.rol}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/usuarios/${u.id_usuario}/editar`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          const confirmado = confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)
                          if (!confirmado) return
                          try {
                            const res = await fetch(`/api/usuarios/${u.id_usuario}`, {
                              method: "DELETE"
                            })
                            if (!res.ok) throw new Error()
                            setUsuarios((prev) =>
                              prev.filter((user) => user.id_usuario !== u.id_usuario)
                            )
                          } catch (error) {
                            console.error("Error al eliminar usuario:", error)
                            alert("No se pudo eliminar el usuario.")
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
