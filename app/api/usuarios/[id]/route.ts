import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const query = `
      SELECT id_usuario, nombre, apellido, email, usuario, telefono, direccion, estado, id_rol
      FROM usuarios
      WHERE id_usuario = ? AND eliminado = 0
      LIMIT 1
    `
    const [usuario] = await executeQuery(query, [id]) as any[]
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 })
    }
    return NextResponse.json(usuario)
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "No se pudo obtener el usuario." }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { nombre, apellido, email, usuario, telefono, direccion, estado, id_rol } = await req.json()

    const query = `
      UPDATE usuarios
      SET nombre = ?, apellido = ?, email = ?, usuario = ?, telefono = ?, direccion = ?, estado = ?, id_rol = ?, fecha_modificacion = NOW()
      WHERE id_usuario = ?
    `
    const values = [nombre, apellido, email, usuario, telefono, direccion, estado, id_rol, id]
    await executeQuery(query, values)

    return NextResponse.json({ mensaje: "Usuario actualizado correctamente." })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ 
      error: "No se pudo actualizar el usuario.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const query = `
      UPDATE usuarios
      SET eliminado = 1, fecha_modificacion = NOW()
      WHERE id_usuario = ?
    `
    await executeQuery(query, [id])

    return NextResponse.json({ mensaje: "Usuario eliminado correctamente." })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "No se pudo eliminar el usuario." }, { status: 500 })
  }
}
