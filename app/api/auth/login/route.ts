import { type NextRequest, NextResponse } from "next/server";
import { authenticateUser, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { usuario, contrasena } = await request.json();

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(usuario, contrasena);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          usuario: user.usuario,
          rol: user.nombre_rol,
        },
      }
    );

    response.cookies.set("aut-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, 
      path: "/", 
    });

    return response;
  } catch (error: any) {
    console.error("Error en login:", error?.message || error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}