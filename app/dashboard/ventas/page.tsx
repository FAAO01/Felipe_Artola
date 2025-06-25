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
import { Plus, Search, MoreVertical } from "lucide-react"

interface Venta {
  id_venta: number
  cliente_nombre: string
  cliente_apellido: string
  total: number
  fecha_venta: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function VentasPage() {
  const router = useRouter()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchVentas()
  }, [search, page])

  const fetchVentas = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      params.append("page", page.toString())
      params.append("limit", "10")

      const response = await fetch(`/api/ventas?${params}`)
      const data = await response.json()

      console.log("🟡 Respuesta API:", data)

      if (Array.isArray(data.ventas)) {
        setVentas(data.ventas)
      } else {
        console.warn("⚠️ Las ventas no son un array:", data.ventas)
        setVentas([])
      }

      setPagination(data.pagination || null)
    } catch (error) {
      console.error("🔴 Error al obtener ventas:", error)
      setVentas([])
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarVenta = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta venta?")) return
    try {
      const res = await fetch(`/api/ventas/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchVentas()
      } else {
        console.error("🔴 No se pudo eliminar la venta")
      }
    } catch (error) {
      console.error("🔴 Error eliminando venta:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">Listado de ventas registradas en el sistema</p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/dashboard/ventas/nueva")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ventas</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ventas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
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
              {ventas.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ventas</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva venta.</p>
                </div>
              ) : (
                ventas.map((venta) => (
                  <div
                    key={venta.id_venta}
                    className="flex items-center justify-between space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Badge variant="secondary">
                          C${Number(venta.total || 0).toLocaleString("es-NI", {
                            minimumFractionDigits: 2,
                          })}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {venta.cliente_nombre || "Sin nombre"} {venta.cliente_apellido || ""}
                          </h3>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1">
                          <span>
                            <span className="font-semibold">Fecha:</span>{" "}
                            {new Date(venta.fecha_venta).toLocaleDateString("es-NI", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </span>
                          <span>
                            <span className="font-semibold">Factura:</span> {venta.id_venta}
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
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/ventas/${venta.id_venta}/editar`)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleEliminarVenta(venta.id_venta)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>
                  <span className="px-2 py-1 text-sm text-muted-foreground">
                    Página {pagination.page} de {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === pagination.pages}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
