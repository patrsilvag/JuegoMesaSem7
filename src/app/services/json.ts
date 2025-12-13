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
 */
@Injectable({ providedIn: 'root' })
export class JsonService {
  constructor(private http: HttpClient, private notifSrv: NotificationService) {}

  /**
   * Obtiene tipo de cambio USD → CLP desde API externa.
   * @returns Observable con el objeto de tasas de cambio o `null` en caso de error.
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
   * Obtiene datos de ventas desde GitHub Pages.
   * @returns Observable con un arreglo de ventas o vacío si falla.
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
   * Obtiene catálogo de categorías desde JSON local.
   * @returns Observable con un objeto de categorías.
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
   * Obtiene catálogo de productos desde JSON local.
   * @returns Observable con un arreglo de productos o vacío si falla.
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
   * Obtiene lista de usuarios desde GitHub Pages.
   * @returns Observable con arreglo de usuarios o vacío si falla.
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
