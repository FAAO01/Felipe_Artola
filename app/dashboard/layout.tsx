import type React from "react"
import Sidebar from "@/components/sidebar"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener la cookie httpOnly en el servidor
  let usuario = null
  const cookieStore = cookies()
  const token = cookieStore.get("aut-token")?.value
  if (token) {
    const payload = verifyToken(token)
    if (payload && payload.usuario && payload.nombre_rol) {
      usuario = { usuario: payload.usuario, nombre_rol: payload.nombre_rol }
    }
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar usuario={usuario} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
