"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard, Package, ShoppingCart, Store,
  Settings, LogOut, Tag, Truck, FileText, Database,
  Users, UserPlus, UserCircle
} from "lucide-react"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categorías", href: "/dashboard/categorias", icon: Tag },
  { name: "Proveedores", href: "/dashboard/proveedores", icon: Truck },
  { name: "Productos", href: "/dashboard/productos", icon: Package },
  { name: "Clientes", href: "/dashboard/clientes", icon: UserPlus },
  { name: "Copia de seguridad", href: "/dashboard/copia-seguridad", icon: Database },
  { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
  { name: "Ventas", href: "/dashboard/ventas", icon: ShoppingCart },
  { name: "Reportes", href: "/dashboard/reportes", icon: FileText },
  { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [usuario, setUsuario] = useState<{ usuario: string; rol: string } | null>(null)

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("aut-token="))
      ?.split("=")[1]

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUsuario({ usuario: payload.usuario, rol: payload.rol })
      } catch (err) {
        console.warn("Token inválido")
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Error en logout:", error)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r shadow-sm">
      {/* Encabezado */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold">Ferretería</span>
        </div>
      </div>

      {/* Menú lateral */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
 {/* Perfil del usuario */}
<div className="px-4 py-4 border-t bg-gray-50">
  <div className="flex items-center space-x-3">
    <div className="bg-gray-200 rounded-full p-1">
      <UserCircle className="h-8 w-8 text-gray-600" />
    </div>
    <div>
      {usuario ? (
        <>
          <div className="font-medium text-gray-800">{usuario.usuario}</div>
          <div className="text-xs text-white inline-block bg-red-500 rounded px-2 py-0.5 mt-1">
          </div>
        </>
      ) : (
        <div className="text-xs text-gray-400">user.id_usuario</div>
      )}
    </div>
  </div>

  <div className="mt-3">
<Button
  onClick={handleLogout}
  variant="ghost"
  className="w-full justify-start text-white bg-red-600 hover:bg-red-700"
>
  <LogOut className="mr-2 h-4 w-4" />
  Cerrar sesión
</Button>
  </div>
</div>
</div>
  )
}
