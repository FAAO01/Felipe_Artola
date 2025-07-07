import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET: Lista categorías, permite búsqueda por nombre o descripción
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.trim() || ""

    let query = `
      SELECT * FROM categorias
      WHERE eliminado = 0 AND estado = 'activo'
    `
    const params: any[] = []

    if (search) {
      query += ` AND (nombre LIKE ? OR descripcion LIKE ?)`
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ` ORDER BY nombre`

    const categorias = await executeQuery(query, params)
    return NextResponse.json({ categorias: Array.isArray(categorias) ? categorias : [] })
  } catch (error) {
    console.error("Error obteniendo categorías:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST: Crea una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion } = await request.json()

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const query = `
      INSERT INTO categorias (nombre, descripcion, usuario_creacion)
      VALUES (?, ?, ?)
    `
    // usuario_creacion: 1 es un placeholder, reemplazar por el usuario real si aplica
    const result = await executeQuery(query, [nombre.trim(), descripcion || "", 1])

    return NextResponse.json({
      message: "Categoría creada exitosamente",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando categoría:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
