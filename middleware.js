import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Rutas públicas (no requieren autenticación)
const publicRoutes = [
  "/", "/login", "/register",
  "/api/auth/login", "/api/auth/logout"
]

// Rutas de autenticación (solo para usuarios no logueados)
const authRoutes = ["/login", "/register"]

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  )

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Si el usuario está autenticado y visita una ruta de login/register, redirigir al dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Si no hay token, redirigir al login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect_to", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar token
  const decoded = verifyToken(token)

  if (!decoded) {
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url))

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/"
    })

    return response
  }

  // 🔐 Verificar permisos por sección
  const seccion = pathname.split("/")[1] // ej: "/ventas" → "ventas"
  const tienePermiso = decoded.permisos?.includes(seccion)

  if (!tienePermiso && !pathname.startsWith("/api/auth")) {
    const redirectUrl = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "No autorizado" }, { status: 403 })
      : NextResponse.redirect(new URL("/no-autorizado", request.url))

    return redirectUrl
  }

  // Agregar headers útiles
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", decoded.id.toString())
  requestHeaders.set("x-user-role", decoded.rol)
  requestHeaders.set("x-username", decoded.usuario)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}