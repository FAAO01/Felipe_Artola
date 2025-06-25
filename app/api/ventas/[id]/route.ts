import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// Obtener una venta por ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const [venta] = await executeQuery(
      `
      SELECT 
        v.id_venta, v.id_cliente, v.metodo_pago, v.fecha_venta, 
        v.subtotal, v.impuesto, v.total,
        c.nombre AS cliente_nombre, c.apellido AS cliente_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE v.id_venta = ? AND v.eliminado = 0
      LIMIT 1
      `,
      [id]
    ) as any[]

    if (!venta) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    return NextResponse.json(venta)
  } catch (error) {
    console.error("Error al obtener venta:", error)
    return NextResponse.json({ error: "Error al obtener venta" }, { status: 500 })
  }
}

// Actualizar datos de una venta
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { id_cliente, metodo_pago, fecha_venta } = await req.json()

    if (!id_cliente || !metodo_pago || !fecha_venta) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    await executeQuery(
      `
      UPDATE ventas
      SET id_cliente = ?, metodo_pago = ?, fecha_venta = ?, fecha_modificacion = NOW()
      WHERE id_venta = ?
      `,
      [id_cliente, metodo_pago, fecha_venta, id]
    )

    return NextResponse.json({ mensaje: "Venta actualizada correctamente" })
  } catch (error) {
    console.error("Error al actualizar venta:", error)
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}
