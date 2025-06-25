"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, MoreVertical } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios registrados en el sistema</p>
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
          <div className="flex items-center space-x-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, usuario o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((u) => (
                <TableRow key={u.id_usuario}>
                  <TableCell>{u.nombre} {u.apellido}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.usuario}</TableCell>
                  <TableCell>{u.rol}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/usuarios/${u.id_usuario}/editar`)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
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
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {usuariosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
