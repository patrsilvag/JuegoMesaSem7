import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../core/auth';
import { NotificationService } from '../core/notification.service';
import { Categoria } from '../models/categoria';
import { Producto } from '../models/producto';
import { Venta } from '../models/ventas';
import { ExchangeRateResponse } from '../models/exchange-rate';


/**
 * Servicio para consumo de datos JSON remotos y locales.
 * - Ventas desde GitHub Pages
 * - Productos y categorías desde `assets/`
 * - Tipo de cambio desde API pública
 *
 * @usageNotes
 * - Utiliza `HttpClient` para realizar peticiones HTTP.
 * - Utiliza `catchError` para manejar errores y mostrar notificaciones de error.
 */
@Injectable({ providedIn: 'root' })
export class JsonService {
  /**
   * Crea una instancia del servicio `JsonService` e inyecta dependencias.
   * @param http Servicio de `HttpClient` para hacer peticiones HTTP.
   * @param notifSrv Servicio de notificación para mostrar errores.
   */
  constructor(private http: HttpClient, private notifSrv: NotificationService) {}

  /**
   * Obtiene el tipo de cambio de USD a CLP desde una API externa.
   * Si hay un error, muestra un mensaje de error y retorna `null`.
   *
   * @returns Observable que emite el objeto de tasas de cambio o `null` si ocurre un error.
   */

  getCambioDolar(): Observable<ExchangeRateResponse | null> {
    return this.http
      .get<ExchangeRateResponse>('https://api.exchangerate-api.com/v4/latest/USD')
      .pipe(
        catchError((error) => {
          this.notifSrv.showError('No se pudo obtener el tipo de cambio.');
          console.error('Error en getCambioDolar()', error);
          return of(null);
        })
      );
  }
  /**
   * Obtiene los datos de ventas desde un archivo JSON remoto en GitHub Pages.
   * Si ocurre un error, muestra un mensaje de error y retorna un arreglo vacío.
   *
   * @returns Observable que emite un arreglo de ventas o un arreglo vacío en caso de error.
   */
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>('https://patrsilvag.github.io/api-ventas/ventas.json').pipe(
      catchError((error) => {
        this.notifSrv.showError('Error al cargar las ventas.');
        console.error('Error en getVentas()', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene el catálogo de categorías desde un archivo JSON local.
   * Si ocurre un error, muestra un mensaje de error y retorna un objeto vacío.
   *
   * @returns Observable que emite un objeto de categorías o un objeto vacío en caso de error.
   */
  getCategorias(): Observable<Record<string, Categoria>> {
    return this.http.get<Record<string, Categoria>>('assets/data/categorias.json').pipe(
      catchError((error) => {
        this.notifSrv.showError('No se pudo cargar el listado de categorías.');
        console.error('Error en getCategorias()', error);
        return of({});
      })
    );
  }

  /**
   * Obtiene el catálogo de productos desde un archivo JSON local.
   * Si ocurre un error, muestra un mensaje de error y retorna un arreglo vacío.
   *
   * @returns Observable que emite un arreglo de productos o un arreglo vacío en caso de error.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>('assets/data/productos.json').pipe(
      catchError((error) => {
        this.notifSrv.showError('Error al cargar los productos.');
        console.error('Error en getProductos()', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene la lista de usuarios desde GitHub Pages.
   * Si ocurre un error, muestra un mensaje de error y retorna un arreglo vacío.
   *
   * @returns Observable que emite un arreglo de usuarios o un arreglo vacío en caso de error.
   */
  getUsuariosRemotos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('https://patrsilvag.github.io/api-usuarios/usuarios.json').pipe(
      catchError((error) => {
        this.notifSrv.showError('No se pudo cargar la lista de usuarios.');
        console.error('Error en getUsuariosRemotos()', error);
        return of([]);
      })
    );
  }
}
