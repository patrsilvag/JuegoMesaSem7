import { Injectable } from '@angular/core';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';


/**
* Servicio de dominio para manipulación de usuarios (registro, edición, etc.).
* Funciona sobre la base del repositorio de usuarios y el servicio de sesión.
*/
@Injectable({ providedIn: 'root' })
export class UserService {
  /**   Lista de usuarios en caché cargada desde localStorage. */
  private usuariosLista: Usuario[] = JSON.parse(localStorage.getItem('usuarios') ?? '[]');

  constructor(private repo: AuthRepository, private authSrv: AuthService) {}

  /**
   *   Registra un nuevo usuario si no existe previamente.
   * @returns `true` si fue exitoso, `false` si ya existía.
   */
  registrarUsuario(data: Usuario): boolean {
    const ok = this.repo.registrar(data);
    if (ok) this.usuariosLista.push(data);
    return ok;
  }

  /**
   *   Actualiza el perfil del usuario actual y sincroniza sesión.
   */
  actualizarPerfil(data: Usuario): boolean {
    const ok = this.repo.actualizar(data);
    if (ok) this.authSrv['guardarSesion'](data);
    return ok;
  }

  /**
   *   Cambia la contraseña de un usuario y sincroniza el caché.
   */
  cambiarClave(correo: string, nueva: string): boolean {
    const ok = this.repo.cambiarClave(correo, nueva);
    if (ok) {
      const user = this.usuariosLista.find((u) => u.correo === correo);
      if (user) user.clave = nueva;
    }
    return ok;
  }

  /**
   *   Valida que la contraseña actual coincida con la ingresada.
   */
  validarClaveActual(correo: string, clave: string): boolean {
    const user = this.usuariosLista.find((u) => u.correo === correo);
    return user?.clave === clave;
  }

  /**
   *   Busca un usuario en caché por correo.
   */
  buscarPorCorreo(correo: string): Usuario | null {
    return this.usuariosLista.find((u) => u.correo === correo) ?? null;
  }
}