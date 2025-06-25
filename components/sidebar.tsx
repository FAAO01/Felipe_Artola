"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Users, Store, Settings, LogOut, Tag, Truck, FileText, Database } from "lucide-react"
import { data } from "autoprefixer"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/productos", icon: Package },
  { name: "Categorías", href: "/dashboard/categorias", icon: Tag },
  { name: "Proveedores", href: "/dashboard/proveedores", icon: Truck },
  { name: "Ventas", href: "/dashboard/ventas", icon: ShoppingCart },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Reportes", href: "/dashboard/reportes", icon: FileText },
  { name: "Copia de seguridad", href: "/dashboard/copia-seguridad", icon: Database },
  { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Error en logout:", error)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold">Ferretería</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

<div className="p-4 border-t">
  <Button
    onClick={handleLogout}
    variant="ghost"
    className="w-full justify-start bg-red-600 text-white hover:bg-red-700"
  >
    <LogOut className="mr-3 h-5 w-5" />
    Cerrar Sesión
  </Button>
</div>

    </div>
  )
}
