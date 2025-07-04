import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function GET(_: NextRequest) {
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

    // Validación básica
    if (!id_rol || !nombre || !apellido || !email || !usuario || !contrasena) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      )
    }

    const existentes = await executeQuery(
      `SELECT id_usuario FROM usuarios WHERE usuario = ? OR email = ?`,
      [usuario, email]
    )

    if (Array.isArray(existentes) && existentes.length > 0) {
      return NextResponse.json(
        { error: "El usuario o correo ya están registrados." },
        { status: 409 }
      )
    }

    const hash = await bcrypt.hash(contrasena, 10)

    await executeQuery(
      `
      INSERT INTO usuarios (
        id_rol, nombre, apellido, email, usuario, contrasena,
        telefono, direccion, estado, usuario_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id_rol,
        nombre.trim(),
        apellido.trim(),
        email.trim(),
        usuario.trim(),
        hash, 
        telefono.trim(),
        direccion.trim(),
        estado,
        usuario_creacion
      ]
    )

    return NextResponse.json({ mensaje: "Usuario creado con éxito." })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
