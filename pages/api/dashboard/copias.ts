import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Consulta: cuenta las copias de seguridad agrupadas por mes
    const resultados = await executeQuery(`
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') AS mes,
        COUNT(*) AS total_copias
      FROM copias
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 12
    `);

    const rows = Array.isArray(resultados) ? resultados : [];
    // Formatea los labels como "Mes Año" (ej: "2024-06")
    const labels = rows.map((r: any) => r.mes);
    const data = rows.map((r: any) => Number(r.total_copias));

    res.status(200).json({ labels, data });
  } catch (error: any) {
    console.error("Error obteniendo datos de copias:", error?.message || error);
    res.status(500).json({ error: "Error al obtener datos de copias" });
  }
}
