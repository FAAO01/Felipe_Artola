import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT * FROM categorias 
      WHERE eliminado = 0 AND estado = 'activo'
      ORDER BY nombre
    `

    const categorias = await executeQuery(query)
    return NextResponse.json({ categorias })
  } catch (error) {
    console.error("Error obteniendo categorías:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion } = await request.json()

    const query = `
      INSERT INTO categorias (nombre, descripcion, usuario_creacion)
      VALUES (?, ?, ?)
    `

    const result = await executeQuery(query, [nombre, descripcion, 1])

    return NextResponse.json({
      message: "Categoría creada exitosamente",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando categoría:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
