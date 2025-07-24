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
import { Plus, Search, Tag, MoreVertical } from "lucide-react"

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string
  estado: string
}

export default function CategoriasPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchCategorias()
  }, [search])

  const fetchCategorias = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      const response = await fetch(`/api/categorias?${params}`)
      const data = await response.json()
      setCategorias(Array.isArray(data.categorias) ? data.categorias : [])
    } catch (error) {
      console.error("Error fetching categorias:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías de productos</p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/dashboard/categorias/nuevo")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorías..."
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
              {categorias.map((categoria) => (
                <div
                  key={categoria.id_categoria}
                  className="flex items-center justify-between space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{categoria.nombre}</h3>
                        <Badge variant={categoria.estado === "inactivo" ? "destructive" : "secondary"}>
                          {categoria.estado}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{categoria.descripcion}</div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/categorias/${categoria.id_categoria}/ver`)}>
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/categorias/${categoria.id_categoria}/editar`)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={async () => {
                          const confirmado = confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)
                          if (!confirmado) return
                          try {
                            const res = await fetch(`/api/categorias/${categoria.id_categoria}`, {
                              method: "DELETE"
                            })
                            if (!res.ok) throw new Error()
                            setCategorias((prev) => prev.filter((cat) => cat.id_categoria !== categoria.id_categoria))
                          } catch (error) {
                            alert("No se pudo eliminar la categoría.")
                          }
                        }}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              {categorias.length === 0 && (
                <div className="text-center py-8">
                  <Tag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva categoría.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
