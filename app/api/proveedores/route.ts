import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT * FROM proveedores 
      WHERE eliminado = 0 AND estado = 'activo'
      ORDER BY nombre
    `

    const proveedores = await executeQuery(query)
    return NextResponse.json({ proveedores })
  } catch (error) {
    console.error("Error obteniendo proveedores:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, ruc, telefono, email, direccion } = await request.json()

    const query = `
      INSERT INTO proveedores (nombre, ruc, telefono, email, direccion, usuario_creacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    const result = await executeQuery(query, [nombre, ruc, telefono, email, direccion, 1])

    return NextResponse.json({
      message: "Proveedor creado exitosamente",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando proveedor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
