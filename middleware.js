import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const middlewareConfig = {
  // Rutas públicas 
  publicRoutes: [
    "/",
    "/login", 
    "/api/auth/login",
    "/api/auth/logout",
    "/api/public/.*" 
  ],
  
  // Rutas de autenticación
  authRoutes: ["/login"],
  
  // Mapeo de permisos
  accessLevels: {
    1: ["dashboard", "proveedores", "categoria", "productos", "clientes", "ventas", "backup", "reportes", "usuarios", "configuracion"],
    2: ["clientes", "ventas"],
    3: ["productos", "categoria", "clientes", "ventas", "proveedores"]
  },
  
  // Rutas excluidas del middleware
  excludedPaths: [
    "/_next/static/.*",
    "/_next/image/.*",
    "/favicon.ico",
    "/.*\\.(?:svg|png|jpg|jpeg|gif|webp)$"
  ]
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  
  if (middlewareConfig.excludedPaths.some(pattern => new RegExp(pattern).test(pathname))) {
    return NextResponse.next();
  }

  if (middlewareConfig.publicRoutes.some(route => {
    if (route.endsWith('.*')) {
      return new RegExp(route).test(pathname);
    }
    return pathname === route || pathname.startsWith(route);
  })) {
    return handlePublicRouteAccess(request, pathname, token);
  }

  if (!token) {
    return handleUnauthenticated(request, pathname);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return handleInvalidToken(request, pathname);
  }

  return handleAuthorization(request, pathname, decoded);
}
function handlePublicRouteAccess(request, pathname, token) {
  const isAuthRoute = middlewareConfig.authRoutes.some(route => pathname.startsWith(route));
  
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

function handleUnauthenticated(request, pathname) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { 
        error: "Unauthorized",
        message: "Authentication required"
      }, 
      { status: 401 }
    );
  }
  
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect_to", pathname);
  return NextResponse.redirect(loginUrl);
}

function handleInvalidToken(request, pathname) {
  const response = pathname.startsWith("/api/")
    ? NextResponse.json(
        { 
          error: "Invalid token",
          message: "Your session has expired or is invalid"
        }, 
        { status: 401 }
      )
    : NextResponse.redirect(new URL("/login", request.url));

  // Limpiar cookie inválida
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Más flexible que 'strict' para mejor UX
    maxAge: 0,
    path: "/"
  });

  return response;
}

function handleAuthorization(request, pathname, decoded) {
  const nivelAcceso = Number(decoded.nivel_acceso);
  const permisos = middlewareConfig.accessLevels[nivelAcceso] || [];
  
  const seccion = pathname.startsWith('/dashboard')
    ? pathname.split('/dashboard/')[1]?.split('/')[0]
    : null;

  // Verificar permisos solo para rutas bajo /dashboard
  if (seccion && !permisos.includes(seccion) && !pathname.startsWith("/api/auth")) {
    return pathname.startsWith("/api/")
      ? NextResponse.json(
          { 
            error: "Forbidden",
            message: "You don't have permission to access this resource"
          }, 
          { status: 403 }
        )
      : NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-user-id", decoded.id.toString());
  headers.set("x-user-role", decoded.rol);
  headers.set("x-access-level", decoded.nivel_acceso.toString());
  headers.set("x-username", decoded.usuario);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
