"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Categoría",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Stock disponible",
        },
        beginAtZero: true,
      },
    },
  }

  if (loading) return <div><center>Cargando...</center></div>
  if (error) return <div>Error: {error}</div>
  if (dataPoints.length === 0) return <center><div>No hay categorias registradas.</div></center>

  return <Bar data={data} options={options} />
}
