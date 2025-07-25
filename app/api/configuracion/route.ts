import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// GET: Obtener configuración
export async function GET(_: NextRequest) {
  try {
    const result = await executeQuery(`
      SELECT nombre_negocio, ruc, moneda, impuesto
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
    let { nombre_negocio, ruc, moneda, impuesto } = body

    // Validaciones defensivas
    if (typeof nombre_negocio !== "string" || nombre_negocio.trim() === "") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 })
    }

    if (typeof ruc !== "string" || ruc.trim().length > 20) {
      return NextResponse.json({ error: "RUC inválido o demasiado largo" }, { status: 400 })
    }

    if (typeof moneda !== "string" || moneda.trim() === "") {
      return NextResponse.json({ error: "Moneda inválida" }, { status: 400 })
    }

    impuesto = Number(impuesto)
    if (isNaN(impuesto) || impuesto < 0 || impuesto > 100) {
      return NextResponse.json({ error: "Impuesto inválido. Debe estar entre 0% y 100%" }, { status: 400 })
    }

    // Ejecutar el UPDATE directamente
    const result = await executeQuery(`
      UPDATE configuracion
      SET nombre_negocio = ?, ruc = ?, moneda = ?, impuesto = ?
    `, [nombre_negocio.trim(), ruc.trim(), moneda.trim(), impuesto])

    console.log("[CONFIG PUT] Resultado UPDATE:", result)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[CONFIGURACION_PUT_ERROR]", error)
    return NextResponse.json(
      { error: "Error al guardar la configuración", detalle: error.message || error },
      { status: 500 }
    )
  }
}
