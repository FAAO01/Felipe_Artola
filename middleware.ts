import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/authConfig";

const permissions = [
  {
    path: "/dashboard/categorias",
    actions: {
      crear: ["admin", "gerente"],
      ver: ["admin", "gerente"],
      editar: ["admin", "gerente"],
      eliminar: ["admin"]
    }
  },
  
  {
    path: "/dashboard/proveedores",
    actions: {
      crear: ["admin", "gerente"],
      ver: ["admin", "gerente"],
      editar: ["admin", "gerente"],
      eliminar: ["admin"]
    }
  },
  {
    path: "/dashboard/productos",
    actions: {
      crear: ["admin", "gerente"],
      ver: ["admin", "gerente"],
      editar: ["admin", "gerente"],
      eliminar: ["admin"]
    }
  },
  {
    path: "/dashboard/clientes",
    actions: {
      crear: ["admin", "gerente", "vendedor"],
      ver: ["admin", "gerente", "vendedor"],
      editar: ["admin", "gerente", "vendedor"],
      eliminar: ["admin"]
    }
  },

  {
    path: "/dashboard/ventas",
    actions: {
      crear: ["admin", "gerente", "vendedor"],
      ver: ["admin", "gerente", "vendedor"],
      editar: ["admin", "gerente", "vendedor"],
      eliminar: ["admin"]
    }
  },

  {
    path: "/dashboard/usuarios",
    actions: {
      crear: ["admin"],
      ver: ["admin"],
      editar: ["admin"],
      eliminar: ["admin"]
    }
  },

  {
    path: "/dashboard/reportes",
    actions: {
      crear: ["admin"],
      ver: ["admin"],
      editar: ["admin"],
      eliminar: ["admin"]
    }
  },

  {
    path: "/dashboard/copia-seguridad",
    actions: {
      crear: ["admin"],
      ver: ["admin"],
      editar: ["admin"],
      eliminar: ["admin"]
    }
  },

  {
    path: "/dashboard/configuracion",
    actions: {
      crear: ["admin"],
      ver: ["admin"],
      editar: ["admin"],
      eliminar: ["admin"]
    }
  },
  // ... otras rutas omitidas por brevedad
];

function getAction(request: { method: any; }, pathname: string) {
  if (pathname.startsWith("/api/")) {
    switch (request.method) {
      case "GET": return "ver";
      case "POST": return "crear";
      case "PUT":
      case "PATCH": return "editar";
      case "DELETE": return "eliminar";
    }
  }

  if (pathname.match(/\/nuevo$/)) return "crear";
  if (pathname.match(/\/editar(\/|$)/)) return "editar";
  if (pathname.match(/\/(ver|detalles)(\/|$)/)) return "ver";
  if (pathname.match(/\/eliminar(\/|$)/)) return "eliminar";

  return "ver";
}

function matchPermissionRoute(pathname: string) {
  return permissions.find((perm) => pathname.startsWith(perm.path));
}

async function getUserFromToken(token: string | undefined) {
  try {
    if (!token || !JWT_SECRET) return null;
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("aut-token")?.value;
  const permRoute = matchPermissionRoute(pathname);

  if (!permRoute) return NextResponse.next();

  if (!token) return NextResponse.redirect(new URL("/", request.url));

  const user = await getUserFromToken(token);
  if (!user || typeof user.nombre_rol !== "string") {
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  const rol = user.nombre_rol.toLowerCase();
  const action = getAction(request, pathname);
  const allowedRoles = permRoute.actions[action];

  if (!allowedRoles || !allowedRoles.includes(rol)) {
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  return NextResponse.next();
}

