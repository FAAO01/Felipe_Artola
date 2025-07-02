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

// Paleta de colores para las barras
const COLORS = [
  "rgba(8, 72, 234, 0.8)",
  "rgba(34,197,94,0.8)",
  "rgba(59,130,246,0.8)",
  "rgba(234,179,8,0.8)",
  "rgba(239,68,68,0.8)",
  "rgba(168,85,247,0.8)",
  "rgba(250,204,21,0.8)",
  "rgba(16,185,129,0.8)",
  "rgba(251,113,133,0.8)",
  "rgba(99,102,241,0.8)",
]

function getBarColors(length: number) {
  // Si hay más barras que colores, repite la paleta
  return Array.from({ length }, (_, i) => COLORS[i % COLORS.length])
}

export default function TopClientesChart() {
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/dashboard/clientes-top")
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
        label: "Compras realizadas",
        data: dataPoints,
        backgroundColor: getBarColors(dataPoints.length),
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: "Cliente" },
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 },
      },
      y: {
        title: { display: true, text: "Cantidad de compras" },
        beginAtZero: true,
      },
    },
  }

  if (loading) return <div style={{ textAlign: "center" }}><center>Cargando...</center></div>
  if (error) return <div style={{ textAlign: "center" }}>Error: {error}</div>
  if (dataPoints.length === 0) return <div style={{ textAlign: "center" }}>No hay clientes con compras registradas.</div>

  return <Bar data={data} options={options} />
}