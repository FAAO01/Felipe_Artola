import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(req: NextRequest) {
  try {
    const usuarios = await executeQuery(`
      SELECT 
        u.id_usuario, u.nombre, u.apellido, u.email, u.usuario, u.estado, u.telefono,
        r.nombre_rol AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.eliminado = 0
    `)
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "No se pudo obtener la lista de usuarios." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      id_rol,
      nombre,
      apellido,
      email,
      usuario,
      contrasena,
      telefono,
      direccion,
      estado = "activo",
      usuario_creacion = 1
    } = await req.json()

    const query = `
      INSERT INTO usuarios (
        id_rol, nombre, apellido, email, usuario, contrasena,
        telefono, direccion, estado, usuario_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const valores = [
      id_rol,
      nombre,
      apellido,
      email,
      usuario,
      contrasena,
      telefono,
      direccion,
      estado,
      usuario_creacion
    ]

    await executeQuery(query, valores)

    return NextResponse.json({ mensaje: "Usuario creado con éxito." })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
