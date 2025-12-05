import { Injectable } from '@angular/core';
import { Usuario } from '../../core/auth';
import { AuthRepository } from '../../core/auth.repository';

/**
 *
 * Servicio de administración de usuarios para el panel de control.
 * Centraliza la lógica de:
 * - Carga de usuarios desde el repositorio.
 * - Filtrado por campos dinámicos.
 * - Cambio de estado (activo/inactivo) con persistencia.
 *
 * @usageNotes
 * - Utilizado por el componente `AdminComponent`.
 * - El modelo usado en la vista es `UsuarioAdmin`, no el original `Usuario`.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  /**
   * Inyecta el repositorio de usuarios como fuente de datos central.
   * @param repo Repositorio con métodos para listar y actualizar usuarios.
   */
  constructor(private repo: AuthRepository) {}

  /**
   * Carga todos los usuarios desde el repositorio y los transforma
   * al modelo `UsuarioAdmin`, usado en el panel de administración.
   *
   * @returns {UsuarioAdmin[]} Lista de usuarios con datos relevantes para la vista.
   */
  cargarUsuarios(): UsuarioAdmin[] {
    /**
     * Lista completa de usuarios cargada desde el repositorio.
     * Se utiliza como base para mapear al modelo `UsuarioAdmin`.
     */
    const lista: Usuario[] = this.repo.listarUsuarios();

    return lista.map((u) => ({
      correo: u.correo,
      usuario: u.usuario,
      rol: u.rol,
      status: u.status ?? 'active',
    }));
  }

  /**
   * Filtra usuarios según los criterios de búsqueda del formulario.
   *
   * @param lista Lista completa de usuarios (`UsuarioAdmin[]`) sin filtrar.
   * @param filtros Objeto con posibles filtros: `correo`, `rol`, `estado`.
   * @returns {UsuarioAdmin[]} Lista filtrada según los criterios activos.
   */
  filtrarUsuarios(lista: UsuarioAdmin[], filtros: FiltroAdmin): UsuarioAdmin[] {
    /**
     * Valor del filtro por correo electrónico, normalizado en minúsculas.
     * Se aplica con coincidencia parcial (`includes()`).
     */
    const correoFiltro = (filtros.correo ?? '').trim().toLowerCase();
    /**
     * Valor del filtro por rol (`admin` o `cliente`).
     * Si no se especifica, se considera vacío (sin filtrar).
     */
    const rolFiltro = filtros.rol ?? '';
    /**
     * Valor del filtro por estado (`active` o `inactive`).
     * Si no se especifica, se omite el filtro.
     */
    const estadoFiltro = filtros.estado ?? '';

    return lista.filter((u) => {
      const coincideCorreo = correoFiltro ? u.correo.toLowerCase().includes(correoFiltro) : true;
      const coincideRol = rolFiltro ? u.rol === rolFiltro : true;
      const coincideEstado = estadoFiltro ? u.status === estadoFiltro : true;
      return coincideCorreo && coincideRol && coincideEstado;
    });
  }

  /**
   * Cambia el estado de un usuario entre `active` e `inactive`.
   * Persiste el cambio en el repositorio y actualiza el modelo en memoria.
   *
   * @param usuario Usuario visual del panel cuyo estado se quiere alternar.
   * @returns {boolean} `true` si el cambio fue exitoso, `false` si falló.
   */
  toggleEstado(usuario: UsuarioAdmin): boolean {
    /**
     * Determina el nuevo estado a aplicar al usuario.
     * Si está activo, lo cambia a inactivo, y viceversa.
     */
    const nuevoEstado: 'active' | 'inactive' = usuario.status === 'active' ? 'inactive' : 'active';
    /**
     * Resultado de la operación de actualización de estado en el repositorio.
     * `true` si el cambio se aplicó correctamente; `false` si falló.
     */
    const ok = this.repo.actualizarEstado(usuario.correo, nuevoEstado);

    if (ok) {
      usuario.status = nuevoEstado;
    }

    return ok;
  }
}

/**
 * @description
 * Modelo simplificado de usuario para mostrar en el panel de administración.
 * Contiene solo los campos necesarios para la grilla.
 */
export interface UsuarioAdmin {
  /**
   * Correo electrónico del usuario.
   * @type {string}
   */
  correo: string;

  /**
   * Nombre de usuario o alias visible.
   * @type {string}
   */
  usuario: string;

  /**
   * Rol asignado al usuario (admin o cliente).
   * @type {'admin' | 'cliente'}
   */
  rol: 'admin' | 'cliente';

  /**
   * Estado actual del usuario (activo o inactivo).
   * @type {'active' | 'inactive'}
   */
  status: 'active' | 'inactive';
}

/**
 * @description
 * Estructura de los filtros usados en la vista administrativa.
 */
export interface FiltroAdmin {
  /**
   * Filtro por correo parcial o completo.
   * @type {string}
   */
  correo?: string;

  /**
   * Filtro por rol exacto (admin o cliente).
   * @type {string}
   */
  rol?: string;

  /**
   * Filtro por estado exacto (active o inactive).
   * @type {string}
   */
  estado?: string;
}

