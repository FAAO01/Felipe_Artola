import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET: Obtener configuración
export async function GET(_: NextRequest) {
  try {
    const result = await executeQuery(`
      SELECT nombre_negocio, moneda, impuesto
      FROM configuracion
      LIMIT 1
    `)

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("[CONFIGURACION_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Error al obtener la configuración", detalle: error.message || error },
      { status: 500 }
    )
  }
}

// PUT: Actualizar configuración
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre_negocio, moneda, impuesto } = body

    if (!nombre_negocio || !moneda || isNaN(impuesto)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    await executeQuery(`
      UPDATE configuracion
      SET nombre_negocio = ?, moneda = ?, impuesto = ?
      LIMIT 1
    `, [nombre_negocio, moneda, impuesto])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[CONFIGURACION_PUT_ERROR]", error)
    return NextResponse.json(
      { error: "Error al guardar la configuración", detalle: error.message || error },
      { status: 500 }
    )
  }
}
