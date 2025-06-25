import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET /api/reportes/por-mes
export async function GET(_: NextRequest) {
  try {
    const query = `
      SELECT
        DATE_FORMAT(fecha_venta, '%M') AS mes,
        SUM(total) AS total,
        COUNT(*) AS cantidad
      FROM ventas
      WHERE eliminado = 0
      GROUP BY MONTH(fecha_venta)
      ORDER BY MONTH(fecha_venta)
    `

    const resultado = await executeQuery(query, []) as any[]

    return NextResponse.json(
      Array.isArray(resultado)
        ? resultado.map((fila) => ({
            mes: fila.mes,
            total: parseFloat(fila.total),
            cantidad: fila.cantidad,
          }))
        : []
    )
  } catch (error) {
    console.error("Error generando reporte mensual:", error)
    return NextResponse.json({ error: "Error generando reporte por mes" }, { status: 500 })
  }
}
