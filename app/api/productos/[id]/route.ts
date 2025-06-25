import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const query = `
      SELECT 
        id_producto,
        nombre,
        codigo_barras,
        descripcion,
        precio_venta,
        stock,
        stock_minimo
      FROM productos
      WHERE id_producto = ? AND eliminado = 0
    `

    const results = await executeQuery(query, [id])
    const producto = Array.isArray(results) ? results[0] : null

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ producto })
  } catch (error) {
    console.error("Error obteniendo producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    const query = `
      UPDATE productos SET
        nombre = ?,
        codigo_barras = ?,
        descripcion = ?,
        precio_venta = ?,
        stock = ?,
        stock_minimo = ?
      WHERE id_producto = ?
    `

    await executeQuery(query, [
      data.nombre,
      data.codigo_barras,
      data.descripcion,
      data.precio_venta,
      data.stock,
      data.stock_minimo,
      id,
    ])

    return NextResponse.json({ message: "Producto actualizado correctamente" })
  } catch (error) {
    console.error("Error actualizando producto:", error)
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 })
  }
}
