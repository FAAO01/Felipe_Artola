import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

// 🔐 Extrae el id del usuario desde la cookie del token
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

// 📦 GET: Lista productos con joins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    let query = `
      SELECT 
        p.*,
        c.nombre AS categoria_nombre,
        pr.nombre AS proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.eliminado = 0
    `;
    const params: any[] = [];

    if (search) {
      query += `
        AND (
          p.nombre LIKE ? OR
          p.codigo_barras LIKE ? OR
          p.descripcion LIKE ?
        )
      `;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.nombre`;

    const productos = await executeQuery(query, params);
    return NextResponse.json({ productos: Array.isArray(productos) ? productos : [] });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🧾 POST: Crea producto con trazabilidad del creador
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id_categoria = data.categoria_id ?? data.id_categoria;
    const id_proveedor = data.proveedor_id ?? data.id_proveedor;
    const codigo_barras = data.codigo_barras ?? "";
    const nombre = data.nombre ?? "";
    const descripcion = data.descripcion ?? "";
    const precio_compra = data.precio_compra ?? 0;
    const precio_venta = data.precio_venta ?? 0;
    const stock = data.stock ?? 0;
    const stock_minimo = data.stock_minimo ?? 0;

    const usuario_creacion = getUserIdFromRequest(request);
    if (!usuario_creacion) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (
      !id_categoria ||
      !id_proveedor ||
      !codigo_barras ||
      !nombre ||
      isNaN(Number(precio_venta)) ||
      isNaN(Number(stock)) ||
      isNaN(Number(stock_minimo))
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o hay valores inválidos." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO productos (
        id_categoria, id_proveedor, codigo_barras, nombre, descripcion,
        precio_compra, precio_venta, stock, stock_minimo, usuario_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      id_categoria,
      id_proveedor,
      codigo_barras,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      usuario_creacion,
    ]);

    return NextResponse.json({
      message: "Producto creado exitosamente",
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error("Error creando producto:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
