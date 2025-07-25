import { NextResponse} from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/authConfig";

// Rutas protegidas con sus roles exactos
const protectedRoutes = [
  { path: "/dashboard", roles: ["admin" , "gerente" , 'vendedor'] },
  { path: "/dashboard/categorias", roles: ["admin","gerente"] },
  { path: "/dashboard/proveedores", roles: ["admin", "gerente"] },
  { path: "/dashboard/productos", roles: ["admin", "gerente"] },
  { path: "/dashboard/clientes/", roles: ["admin", "gerente", "vendedor"] },
  { path: "/dashboard/ventas", roles: ["admin", "gerente", "vendedor"] },
  { path: "/dashboard/usuarios", roles: ["admin"] },
  { path: "/dashboard/reportes", roles: ["admin"] },
  { path: "/dashboard/copia-seguridad", roles: ["admin"] },
  { path: "/dashboard/configuracion", roles: ["admin",] },
];


// Verifica el token con compatibilidad para Edge Runtime
async function getUserFromToken(token) {

  try {

    if (!JWT_SECRET) {
      return null;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
    
  } catch (error) {
    return null;
  }
}

// Middleware principal
export async function middleware(request) {

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("aut-token")?.value;

  const route = protectedRoutes.find(r => pathname === r.path);

  if (!route) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const user = await getUserFromToken(token);

  if (!user || typeof user.nombre_rol !== "string") {
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  const rol = user.nombre_rol.toLowerCase();

  if (!route.roles.includes(rol)) {
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }
  return NextResponse.next();
}

