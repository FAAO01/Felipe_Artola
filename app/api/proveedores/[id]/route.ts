import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET /api/proveedores/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID de proveedor inválido." }, { status: 400 })
    }

    const query = `
      SELECT *
      FROM proveedores
      WHERE eliminado = 0 AND id_proveedor = ?
      LIMIT 1
    `
    const proveedores = await executeQuery(query, [id]) as any[]

    if (!proveedores || proveedores.length === 0) {
      return NextResponse.json({ error: "Proveedor no encontrado." }, { status: 404 })
    }

    return NextResponse.json({ proveedor: proveedores[0] })
  } catch (error) {
    console.error("Error obteniendo proveedor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT /api/proveedores/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { nombre, ruc, telefono, email, direccion, estado } = await request.json()

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 })
    }

    const query = `
      UPDATE proveedores
      SET nombre = ?, ruc = ?, telefono = ?, email = ?, direccion = ?, estado = ?
      WHERE id_proveedor = ?
    `

    await executeQuery(query, [nombre, ruc, telefono, email, direccion, estado, id])

    return NextResponse.json({ message: "Proveedor actualizado correctamente" })
  } catch (error) {
    console.error("Error actualizando proveedor:", error)
    return NextResponse.json({ error: "Error al actualizar proveedor" }, { status: 500 })
  }
}

// DELETE /api/proveedores/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 })
    }

    const query = `
      UPDATE proveedores
      SET eliminado = 1
      WHERE id_proveedor = ?
    `

    await executeQuery(query, [id])

    return NextResponse.json({ message: "Proveedor eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminando proveedor:", error)
    return NextResponse.json({ error: "Error al eliminar proveedor" }, { status: 500 })
  }
}
