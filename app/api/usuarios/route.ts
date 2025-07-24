import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import bcrypt from "bcryptjs";

// Función para obtener usuarios
export async function GET(_: NextRequest) {
  try {
    const usuarios = await executeQuery(`
      SELECT 
        u.id_usuario, u.nombre, u.apellido, u.email, u.usuario, u.estado, u.telefono,
        r.nombre_rol AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.eliminado = 0
    `);
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "No se pudo obtener la lista de usuarios." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos en /api/usuarios:", body);

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
    } = body;

    // Validación básica
    const missingFields: string[] = [];
    if (!id_rol) missingFields.push("id_rol");
    if (!nombre) missingFields.push("nombre");
    if (!apellido) missingFields.push("apellido");
    if (!email) missingFields.push("email");
    if (!usuario) missingFields.push("usuario");
    if (!contrasena) missingFields.push("contraseña");

    if (missingFields.length > 0) {
      console.warn("⚠️ Faltan campos obligatorios:", missingFields);
      return NextResponse.json(
        { error: `Faltan campos obligatorios: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Verificar si el rol existe
    console.log("🔍 Verificando existencia de id_rol:", id_rol);
    const rolExistente = await executeQuery(
      `SELECT id_rol FROM roles WHERE id_rol = ?`,
      [id_rol]
    );

    console.log("🧾 Resultado de búsqueda de rol:", rolExistente);
    if (!Array.isArray(rolExistente) || rolExistente.length === 0) {
      console.warn("❌ El rol especificado no existe:", id_rol);
      return NextResponse.json(
        { error: "El rol especificado no existe." },
        { status: 400 }
      );
    }

    // Verificar si usuario o correo ya existen
    const existentes = await executeQuery(
      `SELECT id_usuario FROM usuarios WHERE usuario = ? OR email = ?`,
      [usuario, email]
    );

    console.log("🔎 Chequeando existencia previa de usuario o correo:", existentes);
    if (Array.isArray(existentes) && existentes.length > 0) {
      return NextResponse.json(
        { error: "El usuario o correo ya están registrados." },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(contrasena, 10);
    console.log("🔐 Contraseña hasheada correctamente.");

    // Insertar nuevo usuario
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
    );

    console.log("✅ Usuario insertado exitosamente.");
    return NextResponse.json({ mensaje: "Usuario creado con éxito." }, { status: 201 });
  } catch (error) {
    console.error("🔥 Error al crear usuario:", error);
    return NextResponse.json({ error: "Error al registrar usuario", details: error.message }, { status: 500 });
  }
}