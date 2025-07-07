// route.ts (API logic)
import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET /api/ventas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const offset = (page - 1) * limit

    const baseQuery = `
      SELECT 
        v.*, 
        c.nombre AS cliente_nombre, 
        c.apellido AS cliente_apellido, 
        u.nombre AS vendedor_nombre
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.eliminado = 0
    `

    const searchConditions = search 
      ? `AND (c.nombre LIKE ? OR c.apellido LIKE ? OR v.numero_factura LIKE ?)` 
      : ""

    const query = `
      ${baseQuery}
      ${searchConditions}
      ORDER BY v.fecha_venta DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE v.eliminado = 0
      ${searchConditions}
    `

    const searchParamsArray = search 
      ? [`%${search}%`, `%${search}%`, `%${search}%`] 
      : []

    const ventas = await executeQuery(query, searchParamsArray)
    const countResult = await executeQuery(countQuery, searchParamsArray) as any[]
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      ventas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error obteniendo ventas:", error.message, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST /api/ventas
export async function POST(request: NextRequest) {
  try {
    const { id_cliente, metodo_pago, productos } = await request.json()

    if (!id_cliente || !metodo_pago || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: "Datos incompletos o inválidos." }, { status: 400 })
    }

    let subtotal = 0

    // Validar productos
    for (const producto of productos) {
      const cantidad = Number(producto.cantidad)
      const precio_unitario = Number(producto.precio_unitario)

      if (!producto.id_producto || isNaN(cantidad) || isNaN(precio_unitario)) {
        return NextResponse.json({ error: "Producto mal estructurado." }, { status: 400 })
      }

      subtotal += cantidad * precio_unitario
    }

    // Verificar stock
    for (const producto of productos) {
      const cantidad = Number(producto.cantidad)

      const stockRow = await executeQuery(
        `SELECT stock FROM productos WHERE id_producto = ?`,
        [producto.id_producto]
      ) as any[]

      const stockDisponible = stockRow[0]?.stock
      if (stockDisponible === undefined) {
        return NextResponse.json({ error: `Producto con ID ${producto.id_producto} no encontrado.` }, { status: 404 })
      }

      if (stockDisponible < cantidad) {
        return NextResponse.json({
          error: `Stock insuficiente para el producto ${producto.id_producto}. Disponible: ${stockDisponible}`,
        }, { status: 400 })
      }
    }

    // Calcular totales
    const impuesto = subtotal * 0.18
    const total = subtotal + impuesto
    const numeroFactura = `F${Date.now()}`

    // Insertar venta principal
    const ventaResult = await executeQuery(
      `
      INSERT INTO ventas (
        id_cliente, id_usuario, numero_factura, fecha_venta,
        subtotal, impuesto, total, metodo_pago, usuario_creacion
      ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)
      `,
      [id_cliente, 1, numeroFactura, subtotal, impuesto, total, metodo_pago, 1]
    )

    const id_venta = (ventaResult as any)?.insertId
    if (!id_venta) {
      return NextResponse.json({ error: "No se pudo registrar la venta." }, { status: 500 })
    }

    // Insertar productos vendidos y actualizar stock
    for (const producto of productos) {
      const cantidad = Number(producto.cantidad)
      const precio_unitario = Number(producto.precio_unitario)
      const subtotal_item = cantidad * precio_unitario

      await executeQuery(
        `
        INSERT INTO detalle_ventas (
          id_venta, id_producto, cantidad, precio_unitario, subtotal, usuario_creacion
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [id_venta, producto.id_producto, cantidad, precio_unitario, subtotal_item, 1]
      )

      await executeQuery(
        `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
        [cantidad, producto.id_producto]
      )
    }

    return NextResponse.json({
      message: "Venta registrada exitosamente",
      id: id_venta,
      numero_factura: numeroFactura,
    })
  } catch (error: any) {
    console.error("Error registrando venta:", error.message, error)
    return NextResponse.json(
      { error: "Error al registrar venta", detalle: error.message },
      { status: 500 }
    )
  }
}
