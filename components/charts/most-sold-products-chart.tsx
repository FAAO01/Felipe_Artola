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

export default function MostSoldProductsChart() {
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard/mas-vendidos")
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
        label: "Ventas",
        data: dataPoints,
        backgroundColor: "rgb(0, 225, 255)",
      },
    ],
  }

  return <Bar data={data} />
}
