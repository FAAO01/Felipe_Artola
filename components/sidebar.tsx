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
  const [usuario, setUsuario] = useState<{ usuario: string; nombre_rol: string } | null>(null)
  const [payloadDebug, setPayloadDebug] = useState<any>(null)

  useEffect(() => {
    // Intentar leer primero la cookie no httpOnly para pruebas
    let token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('aut-token-client='))
      ?.split('=')[1];
    // Si no existe, intentar la original (por compatibilidad, aunque no funcionará si es httpOnly)
    if (!token) {
      token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('aut-token='))
        ?.split('=')[1];
    }
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setPayloadDebug(payload)
        if (payload.usuario && payload.nombre_rol) {
          setUsuario({ usuario: payload.usuario, nombre_rol: payload.nombre_rol })
        } else {
          setUsuario(null)
        }
      } catch (err) {
        setPayloadDebug({ error: 'Token inválido' })
        setUsuario(null)
      }
    } else {
      setUsuario(null)
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
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 shadow-lg">
              <UserCircle className="h-8 w-8 text-white" />
            </span>
            {usuario?.nombre_rol && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 text-xs font-semibold text-red-500 border border-red-200 shadow">
                {usuario.nombre_rol}
              </span>
            )}
          </div>
          <div>
            {usuario ? (
              <>
                <div className="font-semibold text-gray-900 text-base">{usuario.usuario}</div>
                <div className="text-xs text-gray-500 mt-1">Bienvenido de nuevo</div>
              </>
            ) : (
              <div className="text-xs text-gray-400 italic">
                No autenticado
                {payloadDebug && (
                  <div className="mt-2 text-[10px] text-gray-400 break-all">
                    <b>Payload JWT:</b>
                    <pre>{JSON.stringify(payloadDebug, null, 2)}</pre>
                  </div>
                )}
              </div>
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
