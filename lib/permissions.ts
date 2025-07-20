import { executeQuery } from "@/lib/database"

interface Permiso {
  nombre: string
}

export async function getPermisosPorUsuario(id_usuario: number): Promise<string[]> {
  try {
    // Obtener el id_rol del usuario
    const rolResult = await executeQuery(
      `SELECT id_rol FROM usuarios WHERE id_usuario = ?`,
      [id_usuario]
    )

    if (!rolResult || rolResult.length === 0) {
      throw new Error("Usuario no encontrado")
    }

    const id_rol = rolResult[0].id_rol

    // Obtener permisos por rol
    const rolPermisos = await executeQuery(
      `SELECT permisos.nombre FROM permisos
       JOIN rol_permisos ON permisos.id_permiso = rol_permisos.id_permiso
       WHERE rol_permisos.id_rol = ?`,
      [id_rol]
    )

    // Obtener permisos individuales por usuario
    const usuarioPermisos = await executeQuery(
      `SELECT permisos.nombre FROM permisos
       JOIN permisos_usuario ON permisos.id_permiso = permisos_usuario.id_permiso
       WHERE permisos_usuario.id_usuario = ?`,
      [id_usuario]
    )

    // Combinar ambos sin duplicados
    const permisos = new Set<string>()
    ;(rolPermisos as Permiso[]).forEach(p => permisos.add(p.nombre))
    ;(usuarioPermisos as Permiso[]).forEach(p => permisos.add(p.nombre))

    return Array.from(permisos)
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error)
    throw new Error("No se pudieron obtener los permisos del usuario.")
  }
}

