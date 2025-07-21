"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

interface ProductoVenta {
  id_producto: number
  producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface VentaDetalle {
  id_venta: number
  cliente: string
  fecha: string
  metodo_pago: string
  productos: ProductoVenta[]
}

export default function Page() {
  const params = useParams()
  const id = params?.id as string | undefined
  const router = useRouter()
  const [venta, setVenta] = useState<VentaDetalle | null>(null)

  useEffect(() => {
    const obtenerVenta = async () => {
      const res = await fetch(`/api/ventas/${id}`)
      const data = await res.json()
      setVenta(data.venta)
    }

    obtenerVenta()
  }, [id])

  useEffect(() => {
    if (venta) {
      setTimeout(() => window.print(), 300)
    }
  }, [venta])

  const mostrar = (v: any) =>
    new Intl.NumberFormat("es-NI", { minimumFractionDigits: 2 }).format(Number(v ?? 0))

  // Función segura para parsear números
  const parseNumber = (value: any) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // Asegurar que todos los valores sean números válidos antes de calcular
  const subtotal = venta?.productos.reduce((acc, p) => {
    return acc + parseNumber(p.subtotal)
  }, 0) ?? 0

  const impuesto = parseNumber(subtotal) * 0.18
  const total = parseNumber(subtotal) + parseNumber(impuesto)

  if (!venta) return null

  return (
    <html>
      <head>
        <title>Factura #{venta.id_venta}</title>
        <style>
          {`@media print {
            .noprint { display: none }
          }
          body {
            font-family: sans-serif;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
          }
          table th, table td {
            padding: 6px 8px;
            border-bottom: 1px solid #ddd;
          }
          `}
        </style>
      </head>
      <body>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <img src="/business.svg" alt="Logo" style={{ width: 60, marginRight: "16px" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Ferretería</h1>
            <p style={{ margin: 0 }}>Factura #{venta.id_venta}</p>
            <p style={{ margin: 0 }}>
              {new Date(venta.fecha).toLocaleString("es-NI")}
            </p>
          </div>
        </div>

        <hr />

        <div style={{ fontSize: "0.95rem", marginBottom: "12px" }}>
          <p><strong>Cliente:</strong> {venta.cliente}</p>
          <p><strong>Método de pago:</strong> {(() => {
            switch (venta.metodo_pago) {
              case "efectivo": return "Efectivo"
              case "tarjeta": return "Tarjeta"
              case "transferencia": return "Transferencia"
              case "credito": return "Crédito"
              default: return venta.metodo_pago
            }
          })()}</p>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th align="left">Producto</th>
              <th align="center">Cant</th>
              <th align="right">Precio</th>
              <th align="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.productos.map((prod, i) => (
              <tr key={i}>
                <td>{prod.producto}</td>
                <td align="center">{prod.cantidad}</td>
                <td align="right">C${mostrar(prod.precio_unitario)}</td>
                <td align="right">C${mostrar(prod.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "right", marginTop: "12px", fontSize: "0.95rem" }}>
          <p>Subtotal: C${mostrar(subtotal)}</p>
          <p>IVA (18%): C${mostrar(impuesto)}</p>
          <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Total: C${mostrar(total)}</p>
        </div>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <p>¡Gracias por su compra!</p>
        </div>

        <div className="noprint" style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => router.push("/dashboard/ventas")} style={{
            padding: "8px 14px",
            border: "1px solid #999",
            borderRadius: "4px",
            background: "#f7f7f7",
            cursor: "pointer"
          }}>
            Volver
          </button>
        </div>
      </body>
    </html>
  )
}
