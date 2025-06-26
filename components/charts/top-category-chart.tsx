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
        label: "Categorías",
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

  return <Pie data={data} />
}
