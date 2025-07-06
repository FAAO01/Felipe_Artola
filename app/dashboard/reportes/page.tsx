"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  BarChart3,
  DollarSign,
  PackageSearch,
  Users,
  ClipboardList,
  Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"

export default function ReportesPage() {
  const [resumen, setResumen] = useState<any | null>(null)
  const [categorias, setCategorias] = useState<number>(0)
  const [proveedores, setProveedores] = useState<number>(0)
  const [clientes, setClientes] = useState<number>(0)
  const [productosBajos, setProductosBajos] = useState<any[]>([])
  const [ventasTotales, setVentasTotales] = useState<any[]>([])
  const [ventasCredito, setVentasCredito] = useState<any[]>([])
  const [dataCompletaCategorias, setDataCompletaCategorias] = useState<any[]>([])
  const [dataCompletaProveedores, setDataCompletaProveedores] = useState<any[]>([])
  const [dataCompletaClientes, setDataCompletaClientes] = useState<any[]>([])
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const formatearFecha = (valor: any) => {
    const fecha = new Date(valor)
    return isNaN(fecha.getTime())
      ? "Sin fecha"
      : fecha.toLocaleDateString("es-NI", { year: "numeric", month: "2-digit", day: "2-digit" })
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [
        resReportes,
        resCategorias,
        resProveedores,
        resClientes,
        resProductos,
        resVentasTotales
      ] = await Promise.all([
        fetch("/api/reportes"),
        fetch("/api/categorias"),
        fetch("/api/proveedores"),
        fetch("/api/clientes"),
        fetch("/api/productos"),
        fetch("/api/ventas")
      ])

      const resumenGeneral = await resReportes.json()
      const dataCategorias = await resCategorias.json()
      const dataProveedores = await resProveedores.json()
      const dataClientes = await resClientes.json()
      const dataProductos = await resProductos.json()
      const dataVentasTotales = await resVentasTotales.json()

      const productosFiltrados =
        dataProductos?.productos?.filter((p: any) => p.stock <= 5 && p.eliminado === 0) || []

      // Ventas a crédito (metodo_pago === "credito")
      const ventasCreditoFiltradas = (dataVentasTotales?.ventas ?? []).filter(
        (venta: any) => venta.metodo_pago === "credito"
      )

      setResumen(resumenGeneral)
      setCategorias(dataCategorias?.categorias?.length ?? 0)
      setProveedores(dataProveedores?.proveedores?.length ?? 0)
      setClientes(dataClientes?.clientes?.length ?? 0)
      setProductosBajos(productosFiltrados)
      setVentasTotales(dataVentasTotales?.ventas ?? [])
      setVentasCredito(ventasCreditoFiltradas)
      setDataCompletaCategorias(dataCategorias?.categorias ?? [])
      setDataCompletaProveedores(dataProveedores?.proveedores ?? [])
      setDataCompletaClientes(dataClientes?.clientes ?? [])
    } catch (error) {
      console.error("Error cargando reportes:", error)
    }
  }

  const exportarCard = (title: string, valor: string | number) => {
    let data: any[] = []

    if (title === "Proveedores") {
      data = dataCompletaProveedores.map((prov: any) => ({
        ID: prov.id_proveedor,
        Nombre: prov.nombre,
        RUC: prov.ruc,
        Teléfono: prov.telefono,
        Email: prov.email,
        Dirección: prov.direccion,
        Estado: prov.estado,
        "Fecha de registro": formatearFecha(prov.fecha_creacion)
      }))
    } else if (title === "Clientes") {
      data = dataCompletaClientes.map((cli: any) => ({
        ID: cli.id_cliente,
        Nombre: cli.nombre,
        Apellido: cli.apellido,
        Teléfono: cli.telefono,
        Dirección: cli.direccion,
        Email: cli.email,
        Estado: cli.estado,
        "Fecha de registro": formatearFecha(cli.fecha_creacion)
      }))
    } else if (title === "Categorías") {
      data = dataCompletaCategorias.map((cat: any) => ({
        ID: cat.id_categoria,
        Categoría: cat.nombre,
        Descripción: cat.descripcion,
        Estado: cat.estado,
        "Fecha de registro": formatearFecha(cat.fecha_creacion)
      }))
    } else if (title === "Productos bajos en stock") {
      data = productosBajos.map((prod: any) => ({
        ID: prod.id_producto,
        Nombre: prod.nombre,
        Stock: prod.stock,
        Categoría: prod.categoria,
        Estado: prod.estado
      }))
    } else if (title === "Total ventas") {
      data = ventasTotales.map((venta: any) => ({
        ID: venta.id_venta,
        Cliente: venta.cliente_nombre || venta.cliente || "Sin nombre",
        Total: `C$${Number(venta.total || 0).toLocaleString("es-NI", { minimumFractionDigits: 2 })}`,
        Fecha: formatearFecha(venta.fecha_venta),
        Estado: venta.metodo_pago === "credito"
          ? (Number((venta.saldo_pendiente ?? (venta.total - (venta.abono ?? 0)))) <= 0 ? "Pagado" : "Pendiente")
          : "Pagada"
      }))
    } else if (title === "Ventas Pendientes") {
      // Solo ventas a crédito, y mostrar estado según saldo pendiente
      data = ventasCredito.map((venta: any) => {
        const saldoPendiente = Number(
          venta.saldo_pendiente !== undefined
            ? venta.saldo_pendiente
            : (venta.total - (venta.abono ?? 0))
        )
        return {
          ID: venta.id_venta,
          Nombre: venta.cliente_nombre || venta.cliente || "Sin nombre",
          Apellido: venta.cliente_apellido || "",
          Total: `C$${Number(venta.total || 0).toLocaleString("es-NI", { minimumFractionDigits: 2 })}`,
          Abono: `C$${Number(venta.abono || 0).toLocaleString("es-NI", { minimumFractionDigits: 2 })}`,
          "Saldo pendiente": `C$${saldoPendiente.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`,
          Fecha: formatearFecha(venta.fecha_venta),
          Estado: saldoPendiente <= 0 ? "Pagado" : "Pendiente"
        }
      })
    } else {
      data = [{ Reporte: title, Valor: valor }]
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, title.replaceAll(" ", "_"))
    XLSX.writeFile(workbook, `${title.replaceAll(" ", "_")}.xlsx`)
  }

  const cards = resumen
    ? [
        {
          title: "Total ventas",
          icon: DollarSign,
          color: "text-green-600",
          value: `C$${resumen.total?.toFixed(2) ?? "0.00"}`
        },
        {
          title: "Cantidad de ventas",
          icon: BarChart3,
          color: "text-blue-500",
          value: resumen.cantidad_ventas ?? 0
        },
        {
          title: "Productos bajos en stock",
          icon: PackageSearch,
          color: "text-yellow-500",
          value: productosBajos.length
        },
        {
          title: "Última actualización",
          icon: Calendar,
          color: "text-muted-foreground",
          value: formatearFecha(resumen.fecha)
        },
        {
          title: "Categorías",
          icon: ClipboardList,
          color: "text-purple-500",
          value: categorias
        },
        {
          title: "Proveedores",
          icon: Users,
          color: "text-teal-500",
          value: proveedores
        },
        {
          title: "Clientes",
          icon: Users,
          color: "text-orange-500",
          value: clientes
        },
        {
          title: "Ventas Pendientes",
          icon: BarChart3,
          color: "text-red-500",
          value: ventasCredito.filter((venta: any) => {
            const saldoPendiente = Number(
              venta.saldo_pendiente !== undefined
                ? venta.saldo_pendiente
                : (venta.total - (venta.abono ?? 0))
            )
            return saldoPendiente > 0
          }).length
        }
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <div className="flex gap-2 items-center">
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <Button onClick={() => console.log("Filtro:", { fechaInicio, fechaFin })}>
            <Calendar className="h-4 w-4 mr-1" /> Filtrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="relative">
              <div className="absolute top-2 right-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => exportarCard(card.title, card.value)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


