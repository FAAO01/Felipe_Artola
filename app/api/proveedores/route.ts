import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

function getUserIdFromRequest(request: NextRequest): number | null {
  const token = request.cookies.get("aut-token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id_usuario?: number };
    return decoded.id_usuario ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    let query = `
      SELECT * FROM proveedores
      WHERE eliminado = 0 AND estado = 'activo'
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (
        nombre LIKE ? OR
        ruc LIKE ? OR
        email LIKE ? OR
        telefono LIKE ?
      )`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY nombre`;

    const proveedores = await executeQuery(query, params);
    return NextResponse.json({ proveedores: Array.isArray(proveedores) ? proveedores : [] });
  } catch (error) {
    console.error("Error obteniendo proveedores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const { nombre, ruc, telefono, email, direccion } = await request.json();

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const usuario_creacion = getUserIdFromRequest(request);
    if (!usuario_creacion) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const query = `
      INSERT INTO proveedores (nombre, ruc, telefono, email, direccion, usuario_creacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      nombre.trim(),
      ruc || "",
      telefono || "",
      email || "",
      direccion || "",
      usuario_creacion,
    ]);

    return NextResponse.json({
      message: "Proveedor creado exitosamente",
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error("Error creando proveedor:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
