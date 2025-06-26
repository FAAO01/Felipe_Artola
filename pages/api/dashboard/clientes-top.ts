import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resultados = await executeQuery(`
      SELECT c.nombre AS cliente, COUNT(v.id_venta) AS compras
      FROM ventas v
      JOIN clientes c ON c.id_cliente = v.id_cliente
      GROUP BY c.nombre
      ORDER BY compras DESC
      LIMIT 5
    `)

    const rows = Array.isArray(resultados) ? resultados : []
    const labels = rows.map((r: any) => r.cliente)
    const data = rows.map((r: any) => Number(r.compras))

    res.status(200).json({ labels, data })
  } catch (error: any) {
    console.error("Error obteniendo clientes top:", error)
    res.status(500).json({ error: "Error al obtener datos" })
  }
}
