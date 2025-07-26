"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Truck,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"
import { useIsAdminUser } from "@/hooks/use-admin"

interface Proveedor {
  id_proveedor: number
  nombre: string
  ruc: string
  telefono: string
  email: string
  direccion: string
  estado: string
}

export default function ProveedoresPage() {
  const router = useRouter()
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const {isAdmin}=useIsAdminUser()
  

  useEffect(() => {
    fetchProveedores()
  }, [search])

  const fetchProveedores = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      const response = await fetch(`/api/proveedores?${params}`)
      const data = await response.json()
      setProveedores(
        Array.isArray(data.proveedores) ? data.proveedores : Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error("Error fetching proveedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarProveedor = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proveedor?")) return
    try {
      const res = await fetch(`/api/proveedores/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProveedores((prev) => prev.filter((prov) => prov.id_proveedor !== id))
      } else {
        console.error("No se pudo eliminar el proveedor")
      }
    } catch (error) {
      console.error("Error eliminando proveedor:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona la información de tus proveedores</p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/dashboard/proveedores/nuevo")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {proveedores.map((proveedor) => (
                <div
                  key={proveedor.id_proveedor}
                  className="flex items-center justify-between space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{proveedor.nombre}</h3>
                        <Badge variant={proveedor.estado === "inactivo" ? "destructive" : "secondary"}>
                          {proveedor.estado}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" /> {proveedor.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" /> {proveedor.telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" /> {proveedor.direccion}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold">RUC:</span> {proveedor.ruc}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/proveedores/${proveedor.id_proveedor}/detalles`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/proveedores/${proveedor.id_proveedor}/editar`)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4 text-yellow-600" />
                        Editar
                      </DropdownMenuItem>
                      {isAdmin &&(
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => handleEliminarProveedor(proveedor.id_proveedor)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              {proveedores.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo proveedor.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

