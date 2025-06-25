"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BarChart3, DollarSign, PackageSearch } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ResumenGeneral {
  total: number
  cantidad_ventas: number
  productos_bajos: number
  fecha: string
}

interface VentaMensual {
  mes: string
  total: number
  cantidad: number
}

export default function ReportesPage() {
  const [resumen, setResumen] = useState<ResumenGeneral | null>(null)
  const [ventasMensuales, setVentasMensuales] = useState<VentaMensual[]>([])
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const res1 = await fetch("/api/reportes")
      const general = await res1.json()
      setResumen(general)

      const res2 = await fetch("/api/reportes/por-mes")
      const mensuales = await res2.json()
      setVentasMensuales(mensuales)
    } catch (err) {
      console.error("Error cargando reportes:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <div className="flex gap-2 items-center">
          <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <Button onClick={() => console.log("Filtro: ", { fechaInicio, fechaFin })}>
            <Calendar className="h-4 w-4 mr-1" /> Filtrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Total ventas</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              C${resumen?.total?.toFixed(2) ?? "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Cantidad de ventas</CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{resumen?.cantidad_ventas ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Productos bajos en stock</CardTitle>
            <PackageSearch className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{resumen?.productos_bajos ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Última actualización</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-md text-muted-foreground">
              {resumen?.fecha ?? "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen por mes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Total (C$)</TableHead>
                <TableHead>Ventas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasMensuales.map((venta) => (
                <TableRow key={venta.mes}>
                  <TableCell>{venta.mes}</TableCell>
                  <TableCell>C${venta.total.toFixed(2)}</TableCell>
                  <TableCell>{venta.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
