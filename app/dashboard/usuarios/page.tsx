"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [nuevo, setNuevo] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    contrasena: "",
    telefono: "",
    direccion: "",
    id_rol: 1,
  })

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("/api/usuarios")
      const data = await res.json()
      if (Array.isArray(data)) {
        setUsuarios(data)
      } else {
        console.error("Respuesta no esperada:", data)
        setUsuarios([])
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value })
  }

  const crearUsuario = async () => {
    const camposObligatorios = ["nombre", "apellido", "email", "usuario", "contrasena"]
    for (const campo of camposObligatorios) {
      const valor = nuevo[campo as keyof typeof nuevo]
      if (typeof valor === "string" ? !valor.trim() : !valor) {
        toast.warning(`El campo "${campo}" es obligatorio.`)
        return
      }
    }

    try {
      setLoading(true)
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      })
      if (!res.ok) throw new Error("Error al crear usuario")

      toast.success("✅ Usuario registrado con éxito")
      setNuevo({
        nombre: "",
        apellido: "",
        email: "",
        usuario: "",
        contrasena: "",
        telefono: "",
        direccion: "",
        id_rol: 1,
      })
      cargarUsuarios()
    } catch (err) {
      console.error(err)
      toast.error("❌ Ocurrió un error al crear el usuario.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Juan" autoComplete="given-name" />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input name="apellido" value={nuevo.apellido} onChange={handleChange} placeholder="Pérez" autoComplete="family-name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" value={nuevo.email} onChange={handleChange} placeholder="correo@ejemplo.com" autoComplete="email" />
            </div>
            <div>
              <Label>Usuario</Label>
              <Input name="usuario" value={nuevo.usuario} onChange={handleChange} placeholder="usuario123" />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input name="contrasena" type="password" value={nuevo.contrasena} onChange={handleChange} autoComplete="new-password" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input name="telefono" value={nuevo.telefono} onChange={handleChange} placeholder="8888-8888" />
            </div>
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Input name="direccion" value={nuevo.direccion} onChange={handleChange} placeholder="Ciudad, barrio..." />
            </div>
          </div>

          <Button onClick={crearUsuario} className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrar usuario"}
          </Button>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios activos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {usuarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay usuarios registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id_usuario}>
                    <TableCell>{u.nombre} {u.apellido}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.usuario}</TableCell>
                    <TableCell>{u.rol}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
