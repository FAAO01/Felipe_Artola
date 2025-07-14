import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// no requieren autenticación
const publicRoutes = ["/", "/login", "/api/auth/login", "/api/auth/logout"];
const authRoutes = ["/login"];

//permisos según nivel de acceso
const permisosPorNivel = {
  1: ["dashboard", "proveedores", "categoria", "productos", "clientes", "ventas", "copia de seguridad", "reportes", "usuarios", "configuracion"],
  2: ["clientes", "ventas"],
  3: ["productos", "categoría", "clientes", "ventas", "proveedores"]
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirigir si está logueado y entra a login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicRoute) return NextResponse.next();

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/"
    });

    return response;
  }

  // Asignar permisos según nivel de acceso
  const nivel = Number(decoded.nivel_acceso);
  const permisosAsignados = permisosPorNivel[nivel] || [1, 2, 3];

  const seccion = pathname.split("/dashboard")[1]?.split("/")[0]?.replace(/^\/+/, "");
  const tienePermiso = permisosAsignados.includes(seccion);

  if (!tienePermiso && !pathname.startsWith("/api/auth")) {
    const redirectUrl = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "No autorizado" }, { status: 403 })
      : NextResponse.redirect(new URL("/no-autorizado", request.url));
    return redirectUrl;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", decoded.id.toString());
  requestHeaders.set("x-user-role", decoded.rol);
  requestHeaders.set("x-username", decoded.usuario);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};