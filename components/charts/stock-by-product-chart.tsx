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

export default function StockByProductChart() {
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard/categorias-vendidas")
      const json = await res.json()
      setLabels(json.labels)
      setDataPoints(json.data)
    }
    fetchData()
  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: "Unidades vendidas por categoría",
        data: dataPoints,
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  }

  return <Bar data={data} />
}
