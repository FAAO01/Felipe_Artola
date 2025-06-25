import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// Obtener una venta por ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const [venta] = await executeQuery(
      `
      SELECT 
        v.id_venta, v.id_cliente, v.metodo_pago, v.fecha_venta,
        v.subtotal, v.impuesto, v.total,
        v.id_transferencia, v.ultimos4, v.monto_recibido, v.nota,
        c.nombre AS cliente_nombre, c.apellido AS cliente_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE v.id_venta = ? AND v.eliminado = 0
      LIMIT 1
      `,
      [id]
    ) as any[]

    if (!venta) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    const productos = await executeQuery(
      `
      SELECT id_producto, cantidad, precio_unitario
      FROM detalle_ventas
      WHERE id_venta = ?
      `,
      [id]
    )

    return NextResponse.json({ venta: { ...venta, productos } })
  } catch (error) {
    console.error("Error al obtener venta:", error)
    return NextResponse.json({ error: "Error al obtener venta" }, { status: 500 })
  }
}

// Actualizar datos de una venta
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const {
      id_cliente,
      metodo_pago,
      productos,
      id_transferencia,
      ultimos4,
      monto_recibido,
      nota
    } = await req.json()

    if (!id_cliente || !metodo_pago || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    const subtotal = productos.reduce((acc, p) => acc + p.cantidad * p.precio_unitario, 0)
    const impuesto = subtotal * 0.18
    const total = subtotal + impuesto

    // Actualizar tabla de ventas
    await executeQuery(
      `
      UPDATE ventas
      SET 
        id_cliente = ?,
        metodo_pago = ?,
        subtotal = ?,
        impuesto = ?,
        total = ?,
        id_transferencia = ?,
        ultimos4 = ?,
        monto_recibido = ?,
        nota = ?,
        fecha_modificacion = NOW()
      WHERE id_venta = ?
      `,
      [
        id_cliente,
        metodo_pago,
        subtotal,
        impuesto,
        total,
        id_transferencia || null,
        ultimos4 || null,
        monto_recibido || null,
        nota || null,
        id
      ]
    )

    // Actualizar detalle_ventas
    await executeQuery(`DELETE FROM detalle_ventas WHERE id_venta = ?`, [id])

    for (const item of productos) {
      await executeQuery(
        `
        INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
        `,
        [id, item.id_producto, item.cantidad, item.precio_unitario]
      )
    }

    return NextResponse.json({ mensaje: "Venta actualizada correctamente" })
  } catch (error) {
    console.error("Error al actualizar venta:", error)
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}

// Eliminar (soft delete) una venta por ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Soft delete: marcamos la venta como eliminada
    await executeQuery(
      `UPDATE ventas SET eliminado = 1 WHERE id_venta = ?`,
      [id]
    )

    return NextResponse.json({ mensaje: "Venta eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar venta:", error)
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 })
  }
}