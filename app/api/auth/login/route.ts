import { type NextRequest, NextResponse } from "next/server";
import { authenticateUser, generateToken } from "@/lib/auth";

interface LoginBody {
  usuario: string;
  contrasena: string;
}

export async function POST(request: NextRequest) {

  try {
    console.log("Intentando login...");

    const { usuario, contrasena }: LoginBody = await request.json();
    console.log(" Datos recibidos:", usuario);

    const user = await authenticateUser(usuario, contrasena);
    if (!user) {
      console.log("Usuario no autenticado");
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    console.log("Usuario autenticado:", user.usuario);

    const token = generateToken(user);
    console.log("Token generado:", token);

    const response = NextResponse.json({
      message: "Login exitoso",
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.nombre_rol,
      },
    });

    response.cookies.set("aut-token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    console.log(" Cookie establecida correctamente");

    return response;

  } catch (error) {
    console.error("Error inesperado en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

