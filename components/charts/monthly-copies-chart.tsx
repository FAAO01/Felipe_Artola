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

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard/copias")
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
        label: "Copias realizadas",
        data: dataPoints,
        borderColor: "rgb(241, 99, 99)",
        backgroundColor: "rgba(250, 6, 6, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  return <Line data={data} />
}
