import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthErrorService } from './auth-error.service';
import { JsonService } from '../services/json';


/**
* @typedef LoginResultado
* Resultado devuelto por el método `login()` de `AuthService`.
*/
export type LoginResultado = { ok: true; usuario: Usuario } | { ok: false; mensaje: string };


/**
* @description
* Servicio de autenticación de usuarios.
* Maneja login, logout, estado de sesión y carga inicial desde GitHub Pages.
*/
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** @description Fuente observable del usuario autenticado actual */
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  /** @description Stream público del usuario autenticado */
  usuarioActual$ = this.usuarioActual.asObservable();

  constructor(
    private repo: AuthRepository,
    private err: AuthErrorService,
    private jsonService: JsonService
  ) {}

  /**
   * @description Inicializa los usuarios desde JSON remoto (GitHub Pages)
   * si no existen previamente en localStorage.
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

  /** @description Carga la sesión activa desde localStorage. */
  private cargarUsuarioActual(): void {
    const raw = localStorage.getItem('usuarioActual');
    this.usuarioActual.next(raw ? JSON.parse(raw) : null);
  }

  /** @description Persiste o elimina la sesión en localStorage. */
  private guardarSesion(u: Usuario | null): void {
    if (u) {
      localStorage.setItem('usuarioActual', JSON.stringify(u));
    } else {
      localStorage.removeItem('usuarioActual');
    }
    this.usuarioActual.next(u);
  }

  /** @description Devuelve el usuario actual. */
  getUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }

  /**
   * @description Autentica a un usuario por correo y clave.
   * @returns Resultado del intento de login.
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

  /** @description Cierra la sesión del usuario actual. */
  logout(): void {
    this.guardarSesion(null);
  }
}
