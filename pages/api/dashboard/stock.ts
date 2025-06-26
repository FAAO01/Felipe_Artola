import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Agrupa el stock total por categoría
    const resultados = await executeQuery(`
      SELECT c.nombre AS categoria, SUM(p.stock) AS stock_total
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      GROUP BY c.nombre
      ORDER BY stock_total DESC
      LIMIT 5
    `)

    const rows = Array.isArray(resultados) ? resultados : []
    const labels = rows.map((r: any) => r.categoria)
    const data = rows.map((r: any) => Number(r.stock_total))

    res.status(200).json({ labels, data })
  } catch (error) {
    console.error("Error obteniendo stock por categoría:", error)
    res.status(500).json({ error: "Error al obtener datos de stock por categoría" })
  }
}
