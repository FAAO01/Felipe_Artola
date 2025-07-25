import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(_: NextRequest) {
  try {
    // 📦 Consultas en paralelo
    const [
      [ventaTotal],
      [ventaCantidad],
      [stockBajo],
      [fechaMax],
      [categoriaCount],
      [proveedorCount],
      [clienteCount],
      [pendientesCount],
      productosBajosDetalle,
      categoriasDetalle,
      proveedoresDetalle,
      clientesDetalle
    ] = await Promise.all([
      executeQuery(`SELECT IFNULL(SUM(total), 0) AS total FROM ventas WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS cantidad FROM ventas WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS bajos FROM productos WHERE CAST(stock AS SIGNED) <= 0 AND eliminado = 0`),
      executeQuery(`SELECT MAX(fecha_venta) AS fecha FROM ventas`),
      executeQuery(`SELECT COUNT(*) AS total FROM categorias WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS total FROM proveedores WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS total FROM clientes WHERE eliminado = 0`),
      executeQuery(`SELECT COUNT(*) AS pendientes FROM ventas WHERE metodo_pago = 'credito' AND saldo_pendiente > 0 AND eliminado = 0`),
      // 🧩 Productos con categoría
      executeQuery(`
        SELECT p.id_producto, p.nombre, p.stock, p.estado, c.nombre AS categoria 
        FROM productos p 
        JOIN categorias c ON c.id_categoria = p.id_categoria 
        WHERE p.stock <= 10 AND p.eliminado = 0
      `),
      // 🗂️ Categorías con fecha
      executeQuery(`
        SELECT id_categoria, nombre, descripcion, estado, fecha_creacion 
        FROM categorias WHERE eliminado = 0
      `),
      // 🛒 Proveedores con fecha
      executeQuery(`
        SELECT id_proveedor, nombre, ruc, telefono, email, direccion, estado, fecha_creacion 
        FROM proveedores WHERE eliminado = 0
      `),
      // 👥 Clientes con fecha
      executeQuery(`
        SELECT id_cliente, nombre, apellido, telefono, direccion, email, estado, fecha_registro 
        FROM clientes WHERE eliminado = 0
      `)
    ]) as any[]

    // 🗓️ Formateo de fecha
    const formatearFecha = (valor: any) => {
      const fecha = new Date(valor)
      return isNaN(fecha.getTime())
        ? null
        : fecha.toISOString().split("T")[0]
    }

    // 📦 Resumen final
    const resumen = {
      total: parseFloat(ventaTotal.total ?? 0),
      cantidad_ventas: ventaCantidad.cantidad ?? 0,
      productos_bajos: stockBajo.bajos ?? 0,
      fecha: formatearFecha(fechaMax.fecha),
      categorias: categoriaCount.total ?? 0,
      proveedores: proveedorCount.total ?? 0,
      clientes: clienteCount.total ?? 0,
      ventas_pendientes: pendientesCount.pendientes ?? 0,
      // 📁 Detalles completos
      productos_bajos_detalle: productosBajosDetalle,
      categorias_detalle: categoriasDetalle,
      proveedores_detalle: proveedoresDetalle,
      clientes_detalle: clientesDetalle
    }

    return NextResponse.json(resumen)
  } catch (error) {
    console.error("Error generando reporte:", error)
    return NextResponse.json({ error: "Error generando reporte" }, { status: 500 })
  }
}
