import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET /api/roles/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await executeQuery(
      `
      SELECT 
        r.id_rol,
        r.nombre_rol,
        r.descripcion,
        r.nivel_acceso,
        r.fecha_creacion
      FROM roles r
      WHERE r.eliminado = 0 AND r.id_rol = ?
      `,
      [id]
    )

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ success: false, error: "Rol no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, rol: result[0] })
  } catch (error: any) {
    console.error("[ROLES_ID_GET_ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Error al obtener el rol", detalle: error.message || error },
      { status: 500 }
    )
  }
}

// PUT /api/roles/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    const { nombre_rol, descripcion, nivel_acceso } = body

    if (!nombre_rol) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos o inválidos" },
        { status: 400 }
      )
    }

    // 1. Actualizar el rol principal
    await executeQuery(
      `UPDATE roles SET nombre_rol = ?, descripcion = ?, nivel_acceso = ? WHERE id_rol = ?`,
      [nombre_rol, descripcion, nivel_acceso, id]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[ROLES_ID_PUT_ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Error al actualizar el rol", detalle: error.message || error },
      { status: 500 }
    )
  }
}
