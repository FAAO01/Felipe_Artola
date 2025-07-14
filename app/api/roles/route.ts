import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

// Obtener todos los roles
export async function GET(_: NextRequest) {
  try {
    const roles = await executeQuery(`
      SELECT 
        r.id_rol,
        r.nombre_rol,
        r.descripcion,
        r.nivel_acceso,
        r.funciones,
        r.fecha_creacion
      FROM roles r
      WHERE r.eliminado = 0
      ORDER BY r.fecha_creacion DESC
    `);

    if (!Array.isArray(roles)) {
      console.error("[ROLES_GET_ERROR] Resultado inesperado:", roles);
      return NextResponse.json(
        { success: false, error: "La consulta no devolvió una lista válida de roles." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      total: roles.length,
      roles,
    });
  } catch (error: any) {
    console.error("[ROLES_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener los roles",
        detalle: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}

// Crear un nuevo rol
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre_rol, descripcion, nivel_acceso, funciones } = body;

    // Validación básica
    if (!nombre_rol || nivel_acceso === undefined || !Array.isArray(funciones)) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos o inválidos." },
        { status: 400 }
      );
    }

    // Convertir funciones a CSV
    const funcionesCsv = funciones.join(",");

    // Insertar nuevo rol con funciones
    const result = await executeQuery(
      `INSERT INTO roles (nombre_rol, descripcion, nivel_acceso, funciones)
       VALUES (?, ?, ?, ?)`,
      [nombre_rol.trim(), descripcion.trim(), nivel_acceso, funcionesCsv]
    );

    const insertId =
      (result as { insertId?: number })?.insertId ??
      (Array.isArray(result) && (result[0] as { insertId?: number })?.insertId);

    if (!insertId) throw new Error("No se pudo obtener el ID del nuevo rol.");

    return NextResponse.json({ success: true, id_rol: insertId });
  } catch (error: any) {
    console.error("[ROLES_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al guardar el rol",
        detalle: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}

