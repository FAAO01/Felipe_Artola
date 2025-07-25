import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(_: NextRequest) {
  try {
    const ventas = await executeQuery(`
      SELECT 
        v.id_venta,
        v.numero_factura,
        v.total,
        v.abono,
        v.saldo_pendiente,
        v.metodo_pago,
        v.estado,
        v.fecha_venta,
        v.porcentaje_impuesto,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE v.metodo_pago = 'credito'
        AND v.saldo_pendiente > 0
        AND v.eliminado = 0
      ORDER BY v.fecha_venta DESC
    `);

    console.log("Ventas pendientes encontradas:", ventas);

    return NextResponse.json({
      success: true,
      ventas,
    });
  } catch (error) {
    console.error("[VENTAS_PENDIENTES_ERROR]", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener ventas pendientes",
      },
      { status: 500 }
    );
  }
}