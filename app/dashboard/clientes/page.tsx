"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Search, User, Mail, Phone, MapPin, Plus, MoreVertical, UserPlus, Eye, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useIsAdminUser } from "@/hooks/use-admin"

interface Cliente {
  id_cliente: number
  nombre: string
  apellido: string
  tipo_documento: string
  numero_documento: string
  email: string
  telefono: string
  direccion: string
}

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const {isAdmin}=useIsAdminUser()

  useEffect(() => {
    fetchClientes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      const res = await fetch(`/api/clientes?${params}`)
      const data = await res.json()
      setClientes(Array.isArray(data.clientes) ? data.clientes : [])
    } catch (err) {
      console.error("Error obteniendo clientes:", err)
    } finally {
      setLoading(false)
    }
  }

  const eliminarCliente = async (id: number) => {
    const confirmar = confirm("¿Estás seguro de eliminar este cliente?")
    if (!confirmar) return
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" })
      if (res.ok) {
        setClientes(clientes.filter((c) => c.id_cliente !== id))
      } else {
        console.error("No se pudo eliminar el cliente")
      }
    } catch (err) {
      console.error("Error eliminando cliente:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Lista y búsqueda de clientes registrados</p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/dashboard/clientes/nuevo")}
        >
          <Plus className="w-4 h-4 mr-1" /> Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar cliente</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, apellido o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : clientes.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo cliente.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id_cliente}
                  className="flex items-start justify-between border p-4 rounded hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded">
                      <User className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold">
                        {cliente.nombre} {cliente.apellido}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Documento: {cliente.tipo_documento} {cliente.numero_documento}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {cliente.email}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4" /> {cliente.telefono}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {cliente.direccion}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/clientes/${cliente.id_cliente}/ver`)}>
                        <Eye className="h-4 w-4 text-blue-600 mr-2" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/clientes/${cliente.id_cliente}/editar`)}>
                        <Pencil className="h-4 w-4 text-yellow-600 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      {isAdmin && (
                      <DropdownMenuItem
                        className="text-red-600 flex items-center"
                        onClick={() => eliminarCliente(cliente.id_cliente)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

