import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from './auth';


/**
* Repositorio de usuarios que encapsula el acceso a `localStorage`.
 * Se encarga de todas las operaciones CRUD sobre la entidad `Usuario`
 * dentro del navegador.
 *
 * @usageNotes
 * - No acceder directamente a `localStorage` desde componentes.
 * - Todos los servicios de dominio deben usar este repositorio.
 * - Está preparado para evitar errores en entornos SSR.
 */
@Injectable({ providedIn: 'root' })
export class AuthRepository {
  /**
   * Indica si el código corre en entorno navegador.
   * Se utiliza para prevenir accesos a `localStorage` fuera del browser
   */
  private isBrowser: boolean;

  /**
   * Constructor del repositorio.
   *
   * @param platformId Token de Angular que indica la plataforma actual.
   *
   * @usageNotes
   * - Detecta si la aplicación se ejecuta en navegador.
   * - No ejecuta lógica de negocio ni inicialización de datos.
   */
  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Lista todos los usuarios desde localStorage.
   * @returns Arreglo de usuarios.
   *
   * @remarks
   * Método privado usado internamente por el repositorio.
   * Devuelve un arreglo vacío si no está en entorno navegador.
   */
  private listarUsuariosPrivado(): Usuario[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem('usuarios') ?? '[]');
  }

  /**
   * Persiste la lista completa de usuarios en `localStorage`.
   *
   * @param lista Lista completa de usuarios a guardar.
   *
   * @remarks
   * Método privado. Toda persistencia debe pasar por aquí.
   */
  private guardarUsuariosPrivado(lista: Usuario[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }

  /**
   * Devuelve todos los usuarios almacenados.
   *
   * @returns Arreglo de usuarios persistidos.
   */
  listarUsuarios(): Usuario[] {
    return this.listarUsuariosPrivado();
  }

  /**
   * Guarda una lista completa de usuarios.
   *
   * @param lista Lista de usuarios a persistir.
   *
   * @usageNotes
   * Usado principalmente para inicialización desde JSON remoto.
   */
  guardarUsuarios(lista: Usuario[]): void {
    this.guardarUsuariosPrivado(lista);
  }

  /**
   * Indica si existen usuarios registrados en el sistema.
   *
   * @returns `true` si hay usuarios en almacenamiento,
   * `false` si está vacío.
   */
  hayUsuarios(): boolean {
    return this.listarUsuarios().length > 0;
  }

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @param user Usuario a registrar.
   * @returns `true` si el usuario fue registrado correctamente,
   * `false` si ya existía un usuario con el mismo correo.
   */
  registrar(user: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    if (lista.some((u) => u.correo === user.correo)) return false;
    lista.push(user);
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /**
   * Autentica un usuario mediante correo y contraseña.
   *
   * @param correo Correo electrónico del usuario.
   * @param clave Contraseña en texto plano.
   * @returns El usuario autenticado o `null` si las credenciales no son válidas.
   */
  login(correo: string, clave: string): Usuario | null {
    return (
      this.listarUsuariosPrivado().find((u) => u.correo === correo && u.clave === clave) ?? null
    );
  }

  /**
   * Actualiza los datos de un usuario existente.
   *
   * @param data Usuario con los datos actualizados.
   * @returns `true` si el usuario fue actualizado,
   * `false` si no se encontró.
   */
  actualizar(data: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === data.correo);
    if (index === -1) return false;
    lista[index] = { ...lista[index], ...data, correo: lista[index].correo };
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /**
   * Cambia la contraseña de un usuario.
   *
   * @param correo Correo del usuario.
   * @param nueva Nueva contraseña.
   * @returns `true` si la contraseña fue actualizada,
   * `false` si el usuario no existe.
   */
  cambiarClave(correo: string, nueva: string): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;
    lista[index].clave = nueva;
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /**
   * Actualiza el estado de un usuario (`active` / `inactive`).
   *
   * @param correo Correo del usuario.
   * @param estado Nuevo estado a asignar.
   * @returns `true` si el estado fue actualizado,
   * `false` si el usuario no existe.
   */
  actualizarEstado(correo: string, estado: 'active' | 'inactive'): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;
    lista[index].status = estado;
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /**
   * Elimina un usuario del sistema por su correo electrónico.
   *
   * @param correo Correo del usuario a eliminar.
   * @returns `true` si el usuario fue eliminado correctamente,
   * `false` si no existía.
   *
   * @usageNotes
   * - No cierra sesión automáticamente.
   * - La lógica de logout debe manejarse desde `AuthService`.
   */
  eliminarUsuario(correo: string): boolean {
    const lista = this.listarUsuarios();
    const nuevaLista = lista.filter((u) => u.correo !== correo);
    const fueEliminado = lista.length !== nuevaLista.length;

    if (fueEliminado) {
      this.guardarUsuarios(nuevaLista);
    }

    return fueEliminado;
  }
}