import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resultados = await executeQuery(`
      SELECT nombre, stock
      FROM productos
      ORDER BY stock DESC
      LIMIT 5
    `)

    const rows = Array.isArray(resultados) ? resultados : (resultados as any).rows || []
    const labels = rows.map((r: any) => r.nombre)
    const data = rows.map((r: any) => r.stock)

    res.status(200).json({ labels, data })
  } catch (error) {
    console.error("Error obteniendo stock:", error)
    res.status(500).json({ error: "Error al obtener datos de stock" })
  }
}
