import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { executeQuery } from "./database";
import { JWT_SECRET } from "./authConfig";

export interface User {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  id_rol: number;
  nombre_rol: string;
  estado: string;
}

export async function authenticateUser(usuario: string, contrasena: string): Promise<User | null> {
  try {
    const query = `
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.usuario = ? AND u.estado = 'activo' AND u.eliminado = 0
    `;
    const results = await executeQuery(query, [usuario]) as any[];
    if (results.length === 0) return null;

    const user = results[0];
    if (!contrasena || !bcrypt.compareSync(contrasena, user.contrasena)) {
      return null;
    }

    await executeQuery(
      "UPDATE usuarios SET ultimo_login = NOW(), intentos_fallidos = 0 WHERE id_usuario = ?",
      [user.id_usuario]
    );

    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      usuario: user.usuario,
      id_rol: user.id_rol,
      nombre_rol: user.nombre_rol,
      estado: user.estado,
    };
  } catch (error) {
    console.error("Error en autenticación:", error);
    return null;
  }
}

export function generateToken(user: User): string {
  
  if (!JWT_SECRET) throw new Error("JWT_SECRET no definido");
  const payload = {
    id_usuario: user.id_usuario,
    usuario: user.usuario,
    id_rol: user.id_rol,
    nombre_rol: user.nombre_rol.toLowerCase(),
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token: string): User | null {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET no definido");
    return jwt.verify(token, JWT_SECRET) as User;
  } catch {
    return null;
  }
}
