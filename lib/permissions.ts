import { executeQuery } from "@/lib/database";

interface Permiso {
  nombre: string;
}

export async function getPermisosPorUsuario(id_usuario: number): Promise<string[]> {
  try {
    // Permisos por rol
    const rolPermisos = await executeQuery(
      `SELECT p.nombre FROM permisos p
       JOIN rol_funciones rf ON p.id_permiso = rf.id_permiso
       JOIN usuarios u ON u.id_rol = rf.id_rol
       WHERE u.id_usuario = ?`,
      [id_usuario]
    );

    // Permisos individuales
    const usuarioPermisos = await executeQuery(
      `SELECT p.nombre FROM permisos p
       JOIN permisos_usuario pu ON p.id_permiso = pu.id_permiso
       WHERE pu.id_usuario = ?`,
      [id_usuario]
    );

    const permisos = new Set<string>();
    (rolPermisos as Permiso[]).forEach(p => permisos.add(p.nombre));
    (usuarioPermisos as Permiso[]).forEach(p => permisos.add(p.nombre));

    return Array.from(permisos);
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error);
    throw new Error("No se pudieron obtener los permisos del usuario.");
  }
}

