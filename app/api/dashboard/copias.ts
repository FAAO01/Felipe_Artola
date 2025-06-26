import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resultados = await executeQuery(`
      SELECT MONTH(fecha_backup) AS mes, COUNT(*) AS cantidad
      FROM respaldos
      GROUP BY mes
    `)

    const meses = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ]

    const rows = Array.isArray(resultados) ? resultados : []
    const labels = rows.map((r: any) => meses[r.mes - 1])
    const data = rows.map((r: any) => r.cantidad)

    res.status(200).json({ labels, data })
  } catch (error) {
    console.error("Error obteniendo copias:", error)
    res.status(500).json({ error: "Error al obtener datos de copias" })
  }
}
