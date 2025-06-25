import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT 
        p.*,
        c.nombre AS categoria_nombre,
        pr.nombre AS proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.eliminado = 0
      ORDER BY p.nombre
    `

    const productos = await executeQuery(query)
    return NextResponse.json({ productos })
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Mapeo de campos del frontend al backend
    const id_categoria = data.categoria_id ?? data.id_categoria
    const id_proveedor = data.proveedor_id ?? data.id_proveedor
    const codigo_barras = data.codigo_barras ?? ""
    const nombre = data.nombre ?? ""
    const descripcion = data.descripcion ?? "" // Opcional, puede venir vacío
    const precio_compra = data.precio_compra ?? 0 // Si no lo envías, pon 0
    const precio_venta = data.precio_venta ?? 0
    const stock = data.stock ?? 0
    const stock_minimo = data.stock_minimo ?? 0
    const usuario_creacion = 1 // O el usuario real si tienes auth

    // Validación básica
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
      )
    }

    const query = `
      INSERT INTO productos (
        id_categoria, id_proveedor, codigo_barras, nombre, descripcion,
        precio_compra, precio_venta, stock, stock_minimo, usuario_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

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
    ])

    return NextResponse.json({
      message: "Producto creado exitosamente",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creando producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}