import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(_: NextRequest) {
  try {
    const [
      [ventaTotal],
      [ventaCantidad],
      [stockBajo],
      [fechaMax],
      [categoriaCount],
      [proveedorCount],
      [clienteCount],
      [pendientesCount],
      productosBajos
    ] = await Promise.all([
      executeQuery(`SELECT IFNULL(SUM(total), 0) AS total FROM ventas WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS cantidad FROM ventas WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS bajos FROM productos WHERE CAST(stock AS SIGNED) <= 0`),
      executeQuery(`SELECT MAX(fecha_venta) AS fecha FROM ventas`),
      executeQuery(`SELECT COUNT(*) AS total FROM categorias`),
      executeQuery(`SELECT COUNT(*) AS total FROM proveedores`),
      executeQuery(`SELECT COUNT(*) AS total FROM clientes`),
      executeQuery(`SELECT COUNT(*) AS pendientes FROM ventas WHERE metodo_pago = 'credito' AND saldo_pendiente > 0 AND eliminado = 0`),
      executeQuery(`SELECT * FROM productos WHERE stock <= 10 AND eliminado = 0`)
    ]) as any[]

    // ✅ Función para asegurar que la fecha esté bien formateada
    const formatearFecha = (valor: any) => {
      const fecha = new Date(valor)
      return isNaN(fecha.getTime())
        ? null
        : fecha.toISOString().split("T")[0]
    }

    const resumen = {
      total: parseFloat(ventaTotal.total ?? 0),
      cantidad_ventas: ventaCantidad.cantidad ?? 0,
      productos_bajos: stockBajo.bajos ?? 0,
      fecha: formatearFecha(fechaMax.fecha),
      categorias: categoriaCount.total ?? 0,
      proveedores: proveedorCount.total ?? 0,
      clientes: clienteCount.total ?? 0,
      ventas_pendientes: pendientesCount.pendientes ?? 0,
      productos_bajos_detalle: productosBajos
    }

    return NextResponse.json(resumen)
  } catch (error) {
    console.error("Error generando reporte:", error)
    return NextResponse.json({ error: "Error generando reporte" }, { status: 500 })
  }
}
