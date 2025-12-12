import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthErrorService } from './auth-error.service';
import { JsonService } from '../services/json';

/**
 * Resultado devuelto por el método `login()` de `AuthService`.
 *
 * - `ok: true` → Login exitoso, contiene el usuario autenticado.
 * - `ok: false` → Fallo de login, contiene mensaje de error.
 *
 * @typedef {Object} LoginResultado
 * @type {{ ok: true, usuario: Usuario } | { ok: false, mensaje: string }}
 */
export type LoginResultado = { ok: true; usuario: Usuario } | { ok: false; mensaje: string };
/**
 * Servicio de autenticación de usuarios.
 * Maneja login, logout, estado de sesión y carga inicial desde GitHub Pages.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Fuente observable del usuario autenticado actual.
   * Emite un objeto Usuario o `null` si no hay sesión.
   */
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  /**
   * Observable para escuchar cambios en la sesión del usuario.
   */
  usuarioActual$ = this.usuarioActual.asObservable();

  /**
   * Constructor del servicio.
   * @param repo Repositorio de usuarios en localStorage.
   * @param err Servicio de mensajes de error.
   * @param jsonService Servicio para cargar usuarios remotos desde JSON.
   */
  constructor(
    private repo: AuthRepository,
    private err: AuthErrorService,
    private jsonService: JsonService
  ) {}

  /**
   * Inicializa los usuarios desde JSON remoto (GitHub Pages)
   * solo si no existen usuarios en localStorage.
   */
  initUsuarios(): void {
    if (this.repo.hayUsuarios()) {
      this.cargarUsuarioActual();
      return;
    }

    this.jsonService.getUsuariosRemotos().subscribe({
      next: (usuarios) => {
        this.repo.guardarUsuarios(usuarios);
        this.cargarUsuarioActual();
      },
      error: () => {
        console.error('Error cargando usuarios remotos');
      },
    });
  }

  /**
   * Carga el usuario actual desde localStorage y actualiza el estado.
   */
  private cargarUsuarioActual(): void {
    const raw = localStorage.getItem('usuarioActual');
    this.usuarioActual.next(raw ? JSON.parse(raw) : null);
  }

  /**
   * Guarda o limpia la sesión de usuario en localStorage.
   * @param u Usuario autenticado o `null` para cerrar sesión.
   */
  private guardarSesion(u: Usuario | null): void {
    if (u) {
      localStorage.setItem('usuarioActual', JSON.stringify(u));
    } else {
      localStorage.removeItem('usuarioActual');
    }
    this.usuarioActual.next(u);
  }

  /**
   * Devuelve el usuario actualmente autenticado.
   * @returns Usuario autenticado o `null` si no hay sesión.
   */
  getUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }

  /**
   * Autentica a un usuario con correo y clave.
   * @param correo Correo electrónico del usuario.
   * @param clave Contraseña en texto plano.
   * @returns Resultado de autenticación con éxito o error.
   */
  login(correo: string, clave: string): LoginResultado {
    try {
      const usuario = this.repo.login(correo.trim(), clave.trim());
      if (!usuario) return { ok: false, mensaje: this.err.credencialesInvalidas() };
      this.guardarSesion(usuario);
      return { ok: true, usuario };
    } catch (error) {
      console.error('Error en login:', error);
      return { ok: false, mensaje: this.err.errorInesperado() };
    }
  }

  /**
   * Cierra la sesión actual.
   */
  logout(): void {
    this.guardarSesion(null);
  }

  /**
   * Elimina al usuario actual del sistema.
   * @param correo Correo del usuario a eliminar.
   * @returns `true` si fue eliminado, `false` si no existía.
   */
  eliminarUsuario(correo: string): boolean {
    return this.repo.eliminarUsuario(correo);
  }
}