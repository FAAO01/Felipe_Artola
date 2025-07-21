import { NextResponse} from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/authConfig";

// Rutas protegidas con sus roles exactos
const protectedRoutes = [
  { path: "/dashboard", roles: ["super-admin", "gerente", "vendedor"] },
  { path: "/dashboard/ventas", roles: ["super-admin", "gerente", "vendedor"] },
  { path: "/dashboard/ventas/crear", roles: ["super-admin", "gerente", "vendedor"] },
  { path: "/dashboard/productos", roles: ["super-admin", "gerente"] },
  { path: "/dashboard/reportes", roles: ["super-admin"] },
  { path: "/dashboard/configuracion/nuevo", roles: ["super-admin"] },
  { path: "/dashboard/proveedores", roles: ["super-admin", "gerente"] },
  { path: "/dashboard/clientes/", roles: ["super-admin", "gerente", "vendedor"] },
  { path: "/dashboard/usuarios", roles: ["super-admin"] },
  { path: "/dashboard/copia-seguridad", roles: ["super-admin"] },
  { path: "/dashboard/categorias", roles: ["super-admin", "gerente"] },
  { path: "/api/categorias", roles: ["super-admin", "gerente"] },
];


// Verifica el token con compatibilidad para Edge Runtime
async function getUserFromToken(token) {

  try {

    if (!JWT_SECRET) {
      console.warn("JWT_SECRET no definido");
      return null;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("Token decodificado:", payload);
    return payload;
    
  } catch (error) {
    console.warn("Token inválido:", error);
    return null;
  }
}

// Middleware principal
export async function middleware(request) {

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("aut-token")?.value;

  console.log("Evaluando acceso a:", pathname);

  const route = protectedRoutes.find(r => pathname === r.path);

  if (!route) {
    console.log("Ruta no protegida");
    return NextResponse.next();
  }

  if (!token) {
    console.warn("Token no encontrado");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const user = await getUserFromToken(token);

  if (!user || typeof user.nombre_rol !== "string") {
    console.warn("Token sin rol válido");
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  const rol = user.nombre_rol.toLowerCase();
  console.log("Rol del usuario:", rol);

  if (!route.roles.includes(rol)) {
    console.warn("Acceso denegado para este rol");
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  console.log("Acceso autorizado");
  return NextResponse.next();
}

