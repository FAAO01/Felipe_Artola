import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Estadísticas generales
    const ventasHoyQuery = `
      SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
      FROM ventas 
      WHERE DATE(fecha_venta) = CURDATE() AND eliminado = 0
    `

    const productosQuery = `
      SELECT COUNT(*) as total
      FROM productos 
      WHERE eliminado = 0 AND estado = 'activo'
    `

    const clientesQuery = `
      SELECT COUNT(*) as total
      FROM clientes 
      WHERE eliminado = 0 AND estado = 'activo'
    `

    const stockBajoQuery = `
      SELECT COUNT(*) as total
      FROM productos 
      WHERE stock <= stock_minimo AND eliminado = 0 AND estado = 'activo'
    `

    const [ventasHoy, productos, clientes, stockBajo] = await Promise.all([
      executeQuery(ventasHoyQuery),
      executeQuery(productosQuery),
      executeQuery(clientesQuery),
      executeQuery(stockBajoQuery),
    ])

    // Ventas por mes (últimos 6 meses)
    const ventasMensualesQuery = `
      SELECT 
        DATE_FORMAT(fecha_venta, '%Y-%m') as mes,
        COUNT(*) as cantidad,
        SUM(total) as monto
      FROM ventas 
      WHERE fecha_venta >= DATE_SUB(NOW(), INTERVAL 6 MONTH) 
        AND eliminado = 0
      GROUP BY DATE_FORMAT(fecha_venta, '%Y-%m')
      ORDER BY mes
    `

    const ventasMensuales = await executeQuery(ventasMensualesQuery)

    // Productos más vendidos
    const productosVendidosQuery = `
      SELECT 
        p.nombre,
        SUM(dv.cantidad) as cantidad_vendida
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      JOIN ventas v ON dv.id_venta = v.id_venta
      WHERE v.fecha_venta >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND v.eliminado = 0
      GROUP BY p.id_producto, p.nombre
      ORDER BY cantidad_vendida DESC
      LIMIT 5
    `

    const productosVendidos = await executeQuery(productosVendidosQuery)

    return NextResponse.json({
      stats: {
        ventasHoy: (ventasHoy as any[])[0],
        productos: (productos as any[])[0].total,
        clientes: (clientes as any[])[0].total,
        stockBajo: (stockBajo as any[])[0].total,
      },
      ventasMensuales,
      productosVendidos,
    })
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
