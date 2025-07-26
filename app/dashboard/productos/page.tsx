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
import { Plus, Search, Package, MoreVertical, Eye, Pencil, Trash } from "lucide-react"
import { useIsAdminUser } from "@/hooks/use-admin"

interface Producto {
  id_producto: number
  nombre: string
  codigo_barras: string
  precio_venta: number
  stock: number
  stock_minimo: number
  categoria_nombre: string
  proveedor_nombre: string
  estado: string
}

export default function ProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const {isAdmin}=useIsAdminUser()

  useEffect(() => {
    fetchProductos()
  }, [search, page])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      const response = await fetch(`/api/productos?${params}`)
      const data = await response.json()
      const productosLimpios = Array.isArray(data.productos)
        ? data.productos.map((p: any) => ({
            ...p,
            precio_venta: Number(p.precio_venta),
            stock: Number(p.stock),
            stock_minimo: Number(p.stock_minimo),
          }))
        : []
      setProductos(productosLimpios)
      setTotalPages(1) 
    } catch (error) {
      console.error("Error al obtener productos:", error)
      setProductos([])
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProductos((prev) => prev.filter((prod) => prod.id_producto !== id))
      } else {
        console.error("No se pudo eliminar el producto")
      }
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Gestiona el inventario de productos</p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/dashboard/productos/nuevo")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
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
          ) : productos.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo producto.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {productos.map((producto) => (
                <div
                  key={producto.id_producto}
                  className="flex items-center justify-between space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{producto.nombre}</h3>
                        <Badge variant={producto.stock <= producto.stock_minimo ? "destructive" : "secondary"}>
                          {producto.estado}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Código: {producto.codigo_barras} · Categoría: {producto.categoria_nombre} · Proveedor: {producto.proveedor_nombre}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">C$ {producto.precio_venta.toFixed(2)}</p>
                    <p className={`text-sm ${producto.stock <= producto.stock_minimo ? "text-red-600" : "text-gray-500"}`}>
                      Stock: {producto.stock}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/productos/${producto.id_producto}/ver`)}>
                        <Eye className="h-4 w-4 text-blue-600" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/productos/${producto.id_producto}/editar`)}>
                        <Pencil className="h-4 w-4 text-yellow-600" />
                        Editar
                      </DropdownMenuItem>
                      {isAdmin &&(
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => handleEliminar(producto.id_producto)}
                      >
                        <Trash className="h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {/* Paginación */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <span className="text-sm">Página {page} de {totalPages}</span>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
