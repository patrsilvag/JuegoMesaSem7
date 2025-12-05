import { Injectable } from '@angular/core';
import { Usuario } from '../../core/auth';
import { AuthRepository } from '../../core/auth.repository';

/**
 * Modelo simplificado para el panel de administración.
 * Solo contiene los campos que realmente se muestran en la grilla.
 */
export interface UsuarioAdmin {
  correo: string;
  usuario: string;
  rol: 'admin' | 'cliente';
  status: 'active' | 'inactive';
}

/**
 * Tipo de filtros aplicables en el panel de administración.
 */
export interface FiltroAdmin {
  correo?: string;
  rol?: string;
  estado?: string;
}

/**
 * Servicio de administración de usuarios.
 *
 * Encapsula:
 * - Carga de usuarios desde el repositorio.
 * - Filtrado por correo, rol y estado.
 * - Cambio de estado activo/inactivo con persistencia en `AuthRepository`.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  /**
   * Inyecta el repositorio de usuarios para trabajar
   * siempre contra la misma fuente de verdad.
   * @param repo Repositorio de usuarios.
   */
  constructor(private repo: AuthRepository) {}

  /**
   * Carga la lista completa de usuarios administrables
   * y la mapea al modelo `UsuarioAdmin` usado en la vista.
   *
   * @returns Lista de usuarios para el panel de administración.
   */
  cargarUsuarios(): UsuarioAdmin[] {
    const lista: Usuario[] = this.repo.listarUsuarios();

    return lista.map((u) => ({
      correo: u.correo,
      usuario: u.usuario,
      rol: u.rol,
      status: u.status ?? 'active',
    }));
  }

  /**
   * Aplica filtros sobre la lista de usuarios del panel.
   *
   * @param lista Lista base de usuarios.
   * @param filtros Objeto con `correo`, `rol` y `estado` opcionales.
   * @returns Lista filtrada.
   */
  filtrarUsuarios(lista: UsuarioAdmin[], filtros: FiltroAdmin): UsuarioAdmin[] {
    const correoFiltro = (filtros.correo ?? '').trim().toLowerCase();
    const rolFiltro = filtros.rol ?? '';
    const estadoFiltro = filtros.estado ?? '';

    return lista.filter((u) => {
      const coincideCorreo = correoFiltro ? u.correo.toLowerCase().includes(correoFiltro) : true;

      const coincideRol = rolFiltro ? u.rol === rolFiltro : true;
      const coincideEstado = estadoFiltro ? u.status === estadoFiltro : true;

      return coincideCorreo && coincideRol && coincideEstado;
    });
  }

  /**
   * Alterna el estado de un usuario entre `'active'` e `'inactive'`
   * y persiste el cambio en el repositorio.
   *
   * @param usuario Usuario del panel cuyo estado se quiere cambiar.
   * @returns `true` si se pudo actualizar en el repositorio, `false` en caso contrario.
   */
  toggleEstado(usuario: UsuarioAdmin): boolean {
    const nuevoEstado: 'active' | 'inactive' = usuario.status === 'active' ? 'inactive' : 'active';

    const ok = this.repo.actualizarEstado(usuario.correo, nuevoEstado);

    if (ok) {
      // Si se guardó bien en el repositorio, actualizamos también el modelo en memoria.
      usuario.status = nuevoEstado;
    }

    return ok;
  }
}
