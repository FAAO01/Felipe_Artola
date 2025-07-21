import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const query = `
      SELECT
        id_categoria,
        nombre,
        descripcion,
        estado
      FROM categorias
      WHERE id_categoria = ? AND eliminado = 0
    `;
    const result = await executeQuery(query, [id]);
    const categoria = Array.isArray(result) ? result[0] : result;

    if (!categoria) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ categoria });
  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { nombre, descripcion, estado } = data;

    const usuario_modificacion = getUserIdFromRequest(request);
    if (!usuario_modificacion) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const query = `
      UPDATE categorias
      SET
        nombre = ?,
        descripcion = ?,
        estado = ?,
        usuario_modificacion = ?,
        fecha_modificacion = NOW()
      WHERE id_categoria = ?
    `;
    const result = await executeQuery(query, [
      nombre,
      descripcion,
      estado,
      usuario_modificacion,
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Categoría no encontrada o no se realizaron cambios" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoría actualizada exitosamente" });
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const usuario_eliminacion = getUserIdFromRequest(request);
    if (!usuario_eliminacion) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const query = `
      UPDATE categorias
      SET
        eliminado = 1,
        usuario_eliminacion = ?,
        fecha_eliminacion = NOW()
      WHERE id_categoria = ?
    `;
    const result = await executeQuery(query, [
      usuario_eliminacion,
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Categoría no encontrada o ya eliminada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
