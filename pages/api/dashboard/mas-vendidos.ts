import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" })
  }

  try {
    const resultados = await executeQuery(`
      SELECT p.nombre, SUM(dv.cantidad) AS total_vendidos
      FROM detalle_ventas dv
      JOIN productos p ON p.id_producto = dv.id_producto
      GROUP BY p.nombre
      ORDER BY total_vendidos DESC
      LIMIT 5
    `)

    const rows = Array.isArray(resultados) ? resultados : []
    const labels = rows.map((r: any) => r.nombre)
    const data = rows.map((r: any) => Number(r.total_vendidos))

    res.status(200).json({ labels, data })
  } catch (error: any) {
    console.error("Error obteniendo productos más vendidos:", error?.message || error)
    const isDev = process.env.NODE_ENV !== "production"
    res.status(500).json({
      error: "Error al obtener datos",
      ...(isDev && { details: error?.message || error }),
    })
  }
}
