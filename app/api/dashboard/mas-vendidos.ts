import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const data = rows.map((r: any) => r.total_vendidos)

    res.status(200).json({ labels, data })
  } catch (error) {
    console.error("Error obteniendo productos más vendidos:", error)
    res.status(500).json({ error: "Error al obtener datos" })
  }
}
