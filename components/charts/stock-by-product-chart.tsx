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
      const res = await fetch("/api/dashboard/stock")
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
        label: "Unidades en stock",
        data: dataPoints,
        backgroundColor: "rgba(16,185,129,0.7)",
      },
    ],
  }

  return <Bar data={data} />
}
