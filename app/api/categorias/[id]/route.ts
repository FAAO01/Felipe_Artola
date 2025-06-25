import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

// GET: Obtener una categoría por su ID
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

// PUT: Actualizar una categoría por su ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { nombre, descripcion, estado } = data; // Asumiendo estos campos para la actualización

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
      1, // ID de usuario de modificación (deberías obtenerlo de la sesión de autenticación)
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

// DELETE: Eliminar lógicamente (soft delete) una categoría por su ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const query = `
      UPDATE categorias
      SET
        eliminado = 1,
        usuario_eliminacion = ?,
        fecha_eliminacion = NOW()
      WHERE id_categoria = ?
    `;
    const result = await executeQuery(query, [
      1, // ID de usuario de eliminación (deberías obtenerlo de la sesión de autenticación)
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
