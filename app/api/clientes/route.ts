import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

// Utilidad para extraer el id_usuario desde el token en cookies
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
    const search = searchParams.get("search") || "";

    let whereClause = "WHERE eliminado = 0";
    const params: any[] = [];

    if (search) {
      whereClause += " AND (nombre LIKE ? OR apellido LIKE ? OR numero_documento LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const query = `
      SELECT * FROM clientes 
      ${whereClause}
      ORDER BY nombre, apellido
    `;

    const clientes = await executeQuery(query, params);
    return NextResponse.json({ clientes });
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const usuario_creacion = getUserIdFromRequest(request);

    if (!usuario_creacion) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const query = `
      INSERT INTO clientes (
        nombre, apellido, tipo_documento, numero_documento,
        email, telefono, direccion, usuario_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      data.nombre,
      data.apellido,
      data.tipo_documento,
      data.numero_documento,
      data.email,
      data.telefono,
      data.direccion,
      usuario_creacion,
    ]);

    return NextResponse.json({
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error("Error creando cliente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
