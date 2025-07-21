import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import jwt from "jsonwebtoken"

// Cambia esto por tu secreto real
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto"

// Utilidad para extraer el id de usuario desde el JWT
function getUserIdFromRequest(request: NextRequest): number | null {
  // Busca el token en cookies (ajusta el nombre si es diferente)
  const token = request.cookies.get("aut-token")?.value || request.cookies.get("token")?.value;
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id_usuario?: number }
    return decoded.id_usuario ?? null
  } catch (err) {
    return null
  }
}

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

    // Obtener el id del usuario autenticado
    const usuario_creacion = getUserIdFromRequest(request)
    if (!usuario_creacion) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const query = `
      INSERT INTO categorias (nombre, descripcion, usuario_creacion)
      VALUES (?, ?, ?)
    `
    const result = await executeQuery(query, [nombre.trim(), descripcion || "", usuario_creacion])

    return NextResponse.json({
      message: "Categoría creada exitosamente",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando categoría:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

