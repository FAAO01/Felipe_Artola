import { executeQuery } from "@/lib/database"

export async function getPermisosPorUsuario(id_usuario: number): Promise<string[]> {
  // Permisos por rol
  const rolPermisos = await executeQuery(
    `SELECT p.nombre FROM permisos p
     JOIN rol_funciones rf ON p.id_permiso = rf.id_permiso
     JOIN usuarios u ON u.id_rol = rf.id_rol
     WHERE u.id_usuario = ?`,
    [id_usuario]
  ) as any[]

  // Permisos individuales
  const usuarioPermisos = await executeQuery(
    `SELECT p.nombre FROM permisos p
     JOIN permisos_usuario pu ON p.id_permiso = pu.id_permiso
     WHERE pu.id_usuario = ?`,
    [id_usuario]
  ) as any[]

  const permisos = new Set<string>()
  rolPermisos.forEach(p => permisos.add(p.nombre))
  usuarioPermisos.forEach(p => permisos.add(p.nombre))

  return Array.from(permisos)
}

