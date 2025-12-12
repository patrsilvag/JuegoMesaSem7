import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../core/auth';

/**
 * @description
 * Servicio centralizado para el consumo de datos JSON en la aplicación.
 * Permite obtener:
 * - JSON local desde `assets/data/` (categorías y productos).
 * - JSON externo publicado en GitHub Pages (ventas).
 * - API real externa (tipo de cambio USD → CLP).
 *
 * @usageNotes
 * - Este servicio es `providedIn: 'root'`, por lo que Angular crea una única instancia global.
 * - Todos los métodos retornan `Observable`, por lo que deben consumirse con `.subscribe()`
 *   o mediante pipes RxJS.
 * - Requiere que `HttpClient` esté provisto en aplicaciones standalone
 *   usando `provideHttpClient()` en `main.ts`.
 */
@Injectable({ providedIn: 'root' })
export class JsonService {
  /**
   * Inyecta el cliente HTTP de Angular para realizar peticiones GET.
   * @param http Cliente HTTP provisto por Angular.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene el tipo de cambio actual desde una API real externa.
   * API: https://api.exchangerate-api.com/v4/latest/USD
   *
   * @returns {Observable<any>}
   * Observable con la respuesta completa del endpoint.
   * La conversión a CLP se obtiene desde `data.rates.CLP`.
   */
  getCambioDolar(): Observable<any> {
    return this.http.get<any>('https://api.exchangerate-api.com/v4/latest/USD');
  }

  /**
   * Obtiene las ventas por categoría desde un JSON externo
   * publicado en GitHub Pages.
   *
   * @returns {Observable<any[]>}
   * Observable con un arreglo de objetos del tipo:
   * `{ categoria: string, ventas: number }`.
   */
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>('https://patrsilvag.github.io/api-ventas/ventas.json');
  }

  /**
   * Obtiene el catálogo de categorías desde JSON local
   * ubicado en `src/assets/data/categorias.json`.
   *
   * @returns {Observable<any>}
   * Observable con un objeto cuyas claves son los slugs
   * y valores contienen título/subtítulo.
   */
  getCategorias(): Observable<any> {
    return this.http.get('assets/data/categorias.json');
  }

  /**
   * Obtiene el catálogo completo de productos desde JSON local
   * ubicado en `src/assets/data/productos.json`.
   *
   * @returns {Observable<any[]>}
   * Observable con un arreglo de productos.
   */
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/productos.json');
  }

  getUsuariosRemotos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('https://patrsilvag.github.io/api-usuarios/usuarios.json');
  }
}
