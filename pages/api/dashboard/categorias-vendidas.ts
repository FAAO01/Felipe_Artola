import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resultados = await executeQuery(`
      SELECT c.nombre AS categoria, SUM(dv.cantidad) AS vendidos
      FROM detalle_ventas dv
      JOIN productos p ON p.id_producto = dv.id_producto
      JOIN categorias c ON c.id_categoria = p.id_categoria
      GROUP BY c.nombre
      ORDER BY vendidos DESC
      LIMIT 5
    `)

    const rows = Array.isArray(resultados) ? resultados : []
    const labels = rows.map((r: any) => r.categoria)
    const data = rows.map((r: any) => Number(r.vendidos))

    res.status(200).json({ labels, data })
  } catch (error: any) {
    console.error("Error obteniendo categorías más vendidas:", error)
    res.status(500).json({ error: "Error al obtener datos" })
  }
}

