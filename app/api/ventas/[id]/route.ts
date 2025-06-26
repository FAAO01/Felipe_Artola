import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET /api/ventas/[id]
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const query = `
      SELECT v.*, p.nombre AS producto_nombre
      FROM ventas v
      LEFT JOIN productos p ON v.id_producto = p.id_producto
      WHERE v.id_venta = ?
    `
    const resultado = await executeQuery(query, [id]) as any[]

    if (!resultado || resultado.length === 0) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ venta: resultado[0] })
  } catch (error) {
    console.error("Error obteniendo venta:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT /api/ventas/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { id_producto, cantidad } = await request.json()

    const query = `
      UPDATE ventas
      SET id_producto = ?, cantidad = ?
      WHERE id_venta = ?
    `

    await executeQuery(query, [id_producto, cantidad, id])
    return NextResponse.json({ message: "Venta actualizada correctamente" })
  } catch (error) {
    console.error("Error actualizando venta:", error)
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}

// DELETE /api/ventas/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const query = `
      DELETE FROM ventas
      WHERE id_venta = ?
    `

    await executeQuery(query, [id])
    return NextResponse.json({ message: "Venta eliminada correctamente" })
  } catch (error) {
    console.error("Error eliminando venta:", error)
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 })
  }
}
