import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET: Lista proveedores, permite búsqueda por nombre, ruc, email o teléfono
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.trim() || ""

    let query = `
      SELECT * FROM proveedores
      WHERE eliminado = 0 AND estado = 'activo'
    `
    const params: any[] = []

    if (search) {
      query += ` AND (
        nombre LIKE ? OR
        ruc LIKE ? OR
        email LIKE ? OR
        telefono LIKE ?
      )`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ` ORDER BY nombre`

    const proveedores = await executeQuery(query, params)
    return NextResponse.json({ proveedores: Array.isArray(proveedores) ? proveedores : [] })
  } catch (error) {
    console.error("Error obteniendo proveedores:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST: Crea un nuevo proveedor
export async function POST(request: NextRequest) {
  try {
    const { nombre, ruc, telefono, email, direccion } = await request.json()

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const query = `
      INSERT INTO proveedores (nombre, ruc, telefono, email, direccion, usuario_creacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    // usuario_creacion: 1 es un placeholder, reemplazar por el usuario real si aplica
    const result = await executeQuery(query, [
      nombre.trim(),
      ruc || "",
      telefono || "",
      email || "",
      direccion || "",
      1,
    ])

    return NextResponse.json({
      message: "Proveedor creado exitosamente",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando proveedor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
