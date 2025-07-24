import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// 📌 GET: obtener producto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const query = `
      SELECT 
        p.id_producto,
        p.nombre,
        p.codigo_barras,
        p.descripcion,
        p.precio_venta,
        p.stock,
        p.stock_minimo,
        p.estado,
        c.nombre AS categoria_nombre,
        pr.nombre AS proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = ? AND p.eliminado = 0
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

// ✏️ PUT: actualizar producto
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

// 🗑️ DELETE: eliminar producto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const query = `
      UPDATE productos
      SET eliminado = 1
      WHERE id_producto = ?
    `
    await executeQuery(query, [id])

    return NextResponse.json({ message: "Producto eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
  }
}