import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    let whereClause = "WHERE eliminado = 0"
    const params: any[] = []

    if (search) {
      whereClause += " AND (nombre LIKE ? OR apellido LIKE ? OR numero_documento LIKE ?)"
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const query = `
      SELECT * FROM clientes 
      ${whereClause}
      ORDER BY nombre, apellido
    `

    const clientes = await executeQuery(query, params)
    return NextResponse.json({ clientes })
  } catch (error) {
    console.error("Error obteniendo clientes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const query = `
      INSERT INTO clientes (
        nombre, apellido, tipo_documento, numero_documento,
        email, telefono, direccion, usuario_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await executeQuery(query, [
      data.nombre,
      data.apellido,
      data.tipo_documento,
      data.numero_documento,
      data.email,
      data.telefono,
      data.direccion,
      1,
    ])

    return NextResponse.json({
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando cliente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
