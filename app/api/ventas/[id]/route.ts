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

// GET /api/ventas/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const resultado = await executeQuery(
      `
      SELECT
        v.id_venta,
        v.id_cliente,
        v.fecha_venta,
        v.metodo_pago,
        v.abono,
        v.saldo_pendiente,
        v.porcentaje_impuesto,       -- 👈 nuevo campo
        v.subtotal,
        v.impuesto,
        v.total,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        p.id_producto,
        p.nombre AS producto,
        dv.cantidad,
        dv.precio_unitario,
        (dv.cantidad * dv.precio_unitario) AS subtotal
      FROM ventas v
      JOIN clientes c ON c.id_cliente = v.id_cliente
      JOIN detalle_ventas dv ON dv.id_venta = v.id_venta
      JOIN productos p ON p.id_producto = dv.id_producto
      WHERE v.id_venta = ?
      `,
      [id]
    ) as any[];

    if (!resultado.length) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    const venta = {
      id_venta: resultado[0].id_venta,
      id_cliente: resultado[0].id_cliente,
      fecha: resultado[0].fecha_venta,
      metodo_pago: resultado[0].metodo_pago,
      abono: resultado[0].abono,
      saldo_pendiente: resultado[0].saldo_pendiente,
      porcentaje_impuesto: resultado[0].porcentaje_impuesto,
      subtotal: resultado[0].subtotal,      // ✅ agregado
      impuesto: resultado[0].impuesto,      // ✅ agregado
      total: resultado[0].total,            // ✅ agregado
      cliente: resultado[0].cliente,
      productos: resultado.map((r) => ({
        id_producto: r.id_producto,
        producto: r.producto,
        cantidad: r.cantidad,
        precio_unitario: r.precio_unitario,
        subtotal: r.subtotal,
      })),
    };

    return NextResponse.json({ venta });
  } catch (error) {
    console.error("Error obteniendo venta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT /api/ventas/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id_usuario = getUserIdFromRequest(request);
    if (!id_usuario) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const id = params.id;
    const { id_cliente, metodo_pago, productos, abono = 0 } = await request.json();

    if (!id_cliente || !metodo_pago || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: "Datos incompletos o inválidos." }, { status: 400 });
    }

    // Recuperar el porcentaje que fue usado al emitir la factura
    const ventaAnterior = await executeQuery(
      `SELECT porcentaje_impuesto FROM ventas WHERE id_venta = ?`,
      [id]
    ) as any[];

    if (!ventaAnterior.length) {
      return NextResponse.json({ error: "Venta no encontrada." }, { status: 404 });
    }

    const impuestoRate = Number(ventaAnterior[0].porcentaje_impuesto) / 100;
    if (isNaN(impuestoRate)) {
      return NextResponse.json({ error: "Porcentaje de impuesto inválido." }, { status: 500 });
    }

    // Calcular montos con el porcentaje original
    const subtotal = productos.reduce(
      (acc: number, p: any) => acc + p.cantidad * p.precio_unitario,
      0
    );

    const impuesto = subtotal * impuestoRate;
    const total = subtotal + impuesto;
    const saldo_pendiente = metodo_pago === "credito" ? total - abono : 0;

    // Actualizar la venta sin tocar el porcentaje_impuesto
    await executeQuery(
      `
      UPDATE ventas
      SET id_cliente = ?, metodo_pago = ?, subtotal = ?, impuesto = ?, 
          total = ?, abono = ?, saldo_pendiente = ?
      WHERE id_venta = ?
      `,
      [id_cliente, metodo_pago, subtotal, impuesto, total, abono, saldo_pendiente, id]
    );

    // Eliminar y registrar detalle actualizado
    await executeQuery(`DELETE FROM detalle_ventas WHERE id_venta = ?`, [id]);

    for (const p of productos) {
      const itemSubtotal = p.cantidad * p.precio_unitario;
      await executeQuery(
        `
        INSERT INTO detalle_ventas (
          id_venta, id_producto, cantidad, precio_unitario, subtotal, usuario_creacion
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [id, p.id_producto, p.cantidad, p.precio_unitario, itemSubtotal, id_usuario]
      );
    }

    return NextResponse.json({ message: "Venta actualizada correctamente." });
  } catch (error: any) {
    console.error("Error al actualizar venta:", error.message);
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 });
  }
}
// DELETE /api/ventas/[id]
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const venta = await executeQuery(
      `SELECT id_venta, eliminado FROM ventas WHERE id_venta = ?`,
      [id]
    ) as any[];

    if (!venta.length) {
      return NextResponse.json({ error: "Venta no encontrada." }, { status: 404 });
    }

    if (venta[0].eliminado === 1) {
      return NextResponse.json({ error: "La venta ya fue eliminada." }, { status: 400 });
    }

    await executeQuery(`UPDATE ventas SET eliminado = 1 WHERE id_venta = ?`, [id]);

    return NextResponse.json({ message: "Venta eliminada correctamente." });
  } catch (error) {
    console.error("Error eliminando venta:", error);
    return NextResponse.json({ error: "Error al eliminar la venta" }, { status: 500 });
  }
}

