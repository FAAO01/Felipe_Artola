import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "1154e1e836a8be2707d59d47fc747d4b3b58c939c0b28ae4e011aed832fb866b";

const protectedRoutes = [
  { path: '/dashboard/ventas', roles: ['admin', "gerente"] },
  { path: '/dashboard/productos', roles: ['admin', 'almacenista'] },
  { path: '/dashboard/reportes', roles: ['admin'] },
  { path: '/dashboard/configuracion', roles: ['admin'] },
  { path: '/dashboard/proveedores', roles: ['admin'] },
  { path: '/dashboard/clientes', roles: ['admin', 'vendedor'] },
  { path: '/dashboard/usuarios', roles: ['', 'almacenista'] },
  { path: '/dashboard/copia-seguridad', roles: ['admin', 'almacenista'] },
  { path: '/dashboard/ventas/crear', roles: ['admin', 'vendedor'] },
  { path: '/dashboard/categorias', roles: ['admin'] },
];

function getUserFromToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('aut-token')?.value;
  console.log('Token:', token);

  const route = protectedRoutes.find(r => pathname.startsWith(r.path));
  console.log('pathname:', pathname);
  if (!route) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/no-autorizado', request.url));
  }

  const user = getUserFromToken(token);

  if (!user || !route.roles.includes(user.rol)) {
    return NextResponse.redirect(new URL('/no-autorizado', request.url));
  }

  return NextResponse.next();
}


