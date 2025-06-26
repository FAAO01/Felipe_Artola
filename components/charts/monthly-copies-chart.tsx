"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function MonthlyCopiesChart() {
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/dashboard/copias")
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
        label: "Copias de seguridad realizadas",
        data: dataPoints,
        borderColor: "rgb(241, 99, 99)",
        backgroundColor: "rgba(250, 6, 6, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mes",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cantidad de copias",
        },
        beginAtZero: true,
      },
    },
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  if (dataPoints.length === 0) return <div>No hay copias de seguridad registradas.</div>

  return <Line data={data} options={options} />
}
