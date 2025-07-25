"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { handleImprimirVenta } from "@/utils/imprimirVenta"

export default function ImprimirPage() {
  const params = useParams()
  const router = useRouter()
  const id_venta = Number(params?.id)

  useEffect(() => {
    if (!id_venta) return
    handleImprimirVenta(id_venta)
      .then(() => {
        // Después de imprimir, regresa a la lista o a donde quieras
        router.push("/dashboard/ventas")
      })
      .catch((err) => {
        console.error("Error al imprimir venta:", err)
        router.push("/dashboard/ventas")
      })
  }, [id_venta, router])

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>Generando la impresión para la venta #{id_venta}...</p>
    </div>
  )
}
