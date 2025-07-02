"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Rol {
  id_rol: number
  nombre_rol: string
}

export default function EditarUsuarioPage() {
  const params = useParams() as Record<string, string | string[]>
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [roles, setRoles] = useState<Rol[]>([])
  const [rolesError, setRolesError] = useState("")
  const [rolesLoading, setRolesLoading] = useState(true)

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    telefono: "",
    direccion: "",
    estado: "activo",
    id_rol: 1, 
  })

  const [formInicial, setFormInicial] = useState(form)

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch(`/api/usuarios/${id}`)
        const data = await res.json()

        if (data?.nombre) {
          const usuarioCargado = {
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            email: data.email || "",
            usuario: data.usuario || "",
            telefono: data.telefono || "",
            direccion: data.direccion || "",
            estado: data.estado || "activo",
            id_rol: data.id_rol || 1,
          }
          setForm(usuarioCargado)
          setFormInicial(usuarioCargado)
        } else {
          toast.warning("Usuario no encontrado")
        }
      } catch (error) {
        toast.error("No se pudo cargar el usuario")
        console.error(error)
      } finally {
        setCargando(false)
      }
    }

    const cargarRoles = async () => {
      try {
        const res = await fetch("/api/roles")
        const data = await res.json()
        if (data.success && Array.isArray(data.roles)) {
          setRoles(data.roles)
        } else {
          setRolesError("No se pudieron cargar los roles.")
        }
      } catch {
        setRolesError("Error al cargar los roles.")
      } finally {
        setRolesLoading(false)
      }
    }

    if (id) {
      cargarUsuario()
      cargarRoles()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === "id_rol" ? Number(value) : value })
  }

  const guardarCambios = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success("Usuario actualizado")
      router.push("/dashboard/usuarios")
    } catch (err) {
      toast.error("Error al actualizar")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cancelar = () => {
    const cambios = JSON.stringify(form) !== JSON.stringify(formInicial)
    if (!cambios || confirm("¿Estás seguro de cancelar? Se perderán los cambios no guardados.")) {
      router.push("/dashboard/usuarios")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Usuario</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cargando ? (
            <p className="text-sm text-muted-foreground col-span-2">Cargando datos del usuario...</p>
          ) : (
            <>
              <div>
                <Label>Nombre</Label>
                <Input name="nombre" value={form.nombre} onChange={handleChange} />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input name="apellido" value={form.apellido} onChange={handleChange} />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" value={form.email} onChange={handleChange} />
              </div>
              <div>
                <Label>Usuario</Label>
                <Input name="usuario" value={form.usuario} onChange={handleChange} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input name="telefono" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label>Dirección</Label>
                <Input name="direccion" value={form.direccion} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label>Estado</Label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label>Rol</Label>
                {rolesLoading ? (
                  <p className="text-sm text-muted-foreground">Cargando roles...</p>
                ) : rolesError ? (
                  <p className="text-sm text-red-500">{rolesError}</p>
                ) : (
                  <select
                    name="id_rol"
                    value={form.id_rol}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                  >
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre_rol}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <Button className="md:col-span-2 mt-4" onClick={guardarCambios} disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="md:col-span-2"
                onClick={cancelar}
              >
                Cancelar
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
