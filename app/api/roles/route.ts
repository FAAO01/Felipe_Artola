import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(_: NextRequest) {
  try {
    const roles = await executeQuery(`
      SELECT 
        r.id_rol,
        r.nombre_rol,
        r.descripcion,
        r.nivel_acceso,
        r.fecha_creacion,
        GROUP_CONCAT(f.funcion ORDER BY f.funcion SEPARATOR ',') AS funciones
      FROM roles r
      LEFT JOIN rol_funciones f ON r.id_rol = f.id_rol
      WHERE r.eliminado = 0
      GROUP BY r.id_rol
      ORDER BY r.fecha_creacion DESC
    `)

    if (!Array.isArray(roles)) {
      console.error("[ROLES_GET_ERROR] Resultado inesperado:", roles)
      return NextResponse.json(
        { success: false, error: "La consulta no devolvió una lista válida de roles." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      total: roles.length,
      roles,
    })
  } catch (error: any) {
    console.error("[ROLES_GET_ERROR]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener los roles",
        detalle: error.message || error.toString(),
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre_rol, descripcion, nivel_acceso, funciones } = body

    if (!nombre_rol || !Array.isArray(funciones)) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos o inválidos" },
        { status: 400 }
      )
    }

    // Insertar rol
    const result = await executeQuery(
      `INSERT INTO roles (nombre_rol, descripcion, nivel_acceso) VALUES (?, ?, ?)`,
      [nombre_rol, descripcion, nivel_acceso]
    )

    // For MySQL2, insertId is on OkPacket or ResultSetHeader
    // Add a type assertion to access insertId safely
    const insertId =
      (result as { insertId?: number })?.insertId ??
      (Array.isArray(result) && (result[0] as { insertId?: number })?.insertId);

    const id_rol = insertId;
    if (!id_rol) throw new Error("No se pudo obtener el ID del nuevo rol")

    // Insertar funciones asociadas al rol
    if (funciones.length > 0) {
      const values = funciones.map((f: string) => `(${id_rol}, '${f}')`).join(",")
      await executeQuery(`INSERT INTO rol_funciones (id_rol, funcion) VALUES ${values}`)
    }

    return NextResponse.json({ success: true, id_rol })
  } catch (error: any) {
    console.error("[ROLES_POST_ERROR]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al guardar el rol",
        detalle: error.message || error.toString(),
      },
      { status: 500 }
    )
  }
}
