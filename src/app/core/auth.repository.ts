import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from './auth';


/**
* 
* Repositorio de usuarios que encapsula el acceso a localStorage.
* Se encarga de todas las operaciones de lectura, escritura y actualización
* de la lista de usuarios persistidos en el navegador.
*
* @usageNotes
* - No usar localStorage directamente desde otros servicios o componentes.
* - Se debe acceder a través de este repositorio.
*/
@Injectable({ providedIn: 'root' })
export class AuthRepository {
  /**
   * Indica si el código corre en entorno navegador.
   */
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Lista todos los usuarios desde localStorage.
   * @returns Arreglo de usuarios.
   */
  private listarUsuariosPrivado(): Usuario[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem('usuarios') ?? '[]');
  }

  /**
   * Persiste los usuarios en localStorage.
   * @param lista Lista completa de usuarios.
   */
  private guardarUsuariosPrivado(lista: Usuario[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }

  /** @inheritdoc */
  listarUsuarios(): Usuario[] {
    return this.listarUsuariosPrivado();
  }

  /** @inheritdoc */
  guardarUsuarios(lista: Usuario[]): void {
    this.guardarUsuariosPrivado(lista);
  }

  /**
   * Indica si hay usuarios almacenados en localStorage.
   * @returns `true` si hay usuarios, `false` si no.
   */
  hayUsuarios(): boolean {
    return this.listarUsuarios().length > 0;
  }

  /** @inheritdoc */
  registrar(user: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    if (lista.some((u) => u.correo === user.correo)) return false;
    lista.push(user);
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /** @inheritdoc */
  login(correo: string, clave: string): Usuario | null {
    return (
      this.listarUsuariosPrivado().find((u) => u.correo === correo && u.clave === clave) ?? null
    );
  }

  /** @inheritdoc */
  actualizar(data: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === data.correo);
    if (index === -1) return false;
    lista[index] = { ...lista[index], ...data, correo: lista[index].correo };
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /** @inheritdoc */
  cambiarClave(correo: string, nueva: string): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;
    lista[index].clave = nueva;
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /** @inheritdoc */
  actualizarEstado(correo: string, estado: 'active' | 'inactive'): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;
    lista[index].status = estado;
    this.guardarUsuariosPrivado(lista);
    return true;
  }

  /**
   * Elimina un usuario por correo desde el almacenamiento.
   * @param correo Correo del usuario a eliminar.
   * @returns `true` si el usuario fue eliminado; `false` si no existía.
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