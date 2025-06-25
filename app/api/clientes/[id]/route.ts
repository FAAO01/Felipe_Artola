import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET /api/clientes/[id]
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const query = `SELECT * FROM clientes WHERE id_cliente = ? AND eliminado = 0`
    const result = await executeQuery(query, [params.id]) as any[]

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ cliente: result[0] })
  } catch (error) {
    console.error("Error al obtener cliente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT /api/clientes/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      direccion,
    } = await request.json()

    const query = `
      UPDATE clientes SET
        nombre = ?, apellido = ?, tipo_documento = ?, numero_documento = ?,
        email = ?, telefono = ?, direccion = ?
      WHERE id_cliente = ?
    `

    await executeQuery(query, [
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      direccion,
      params.id,
    ])

    return NextResponse.json({ message: "" })
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 })
  }
}

// DELETE /api/clientes/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const query = `UPDATE clientes SET eliminado = 1 WHERE id_cliente = ?`
    await executeQuery(query, [params.id])

    return NextResponse.json({ message: "Cliente eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    return NextResponse.json({ error: "Error al eliminar cliente" }, { status: 500 })
  }
}
