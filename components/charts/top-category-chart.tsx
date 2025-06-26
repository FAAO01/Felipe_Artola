"use client"

import { useEffect, useState } from "react"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function TopCategoryChart() {
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/dashboard/stock")
        if (!res.ok) throw new Error("Error al obtener datos")
        const json = await res.json()
        setLabels(json.labels)
        setDataPoints(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: "Stock por Categoría",
        data: dataPoints,
        backgroundColor: [
          "rgba(34,197,94,0.7)",
          "rgba(59,130,246,0.7)",
          "rgba(234,179,8,0.7)",
          "rgba(239,68,68,0.7)",
          "rgba(168,85,247,0.7)",
        ],
      },
    ],
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  if (dataPoints.length === 0) return <div>No hay datos de stock por categoría.</div>

  return <Pie data={data} />
}
