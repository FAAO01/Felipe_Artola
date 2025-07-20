/**
 * Simulación de obtención de permisos por rol.
 * En producción, aquí deberías consultar tu base de datos.
 * 
 * @param {number} rolId - ID del rol
 * @returns {Promise<Array<{nombre: string}>>} - Lista de permisos
 */
export async function getRolPermisos(rolId) {
  // Simulación de permisos por rol
  const permisosPorRol = {
    1: [ // Administrador
      { nombre: 'ventas' },
      { nombre: '2' },
      { nombre: '' },
    ],
    2: [ // Usuario estándar
      { nombre: '' },
    ],
    3: [ // Invitado
      // Sin permisos
    ],
  };

  // Devuelve los permisos correspondientes o un array vacío si el rol no existe
  return permisosPorRol[rolId] || [];
}