import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../../core/cart';
import { JsonService } from '../../services/json';

/**
 * @description
 * Página de listado de productos por categoría. Carga metadatos de categoría y productos
 * desde archivos JSON locales, y los filtra dinámicamente según el `slug` en la ruta.
 *
 * @usageNotes
 * - Se accede por rutas como `/categorias/:slug`.
 * - Muestra el título y subtítulo según la categoría.
 * - Carga datos desde `categorias.json` y `productos.json` usando el servicio `Json`.
 * - Usa `Cart` para añadir productos con cantidad 1.
 */
@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.scss'],
})
export class CategoriaComponent implements OnInit {
  /**
   * Slug de la categoría extraído desde la URL.
   * Ejemplo: 'estrategia', 'infantiles'.
   * @type {string}
   */
  slug!: string;

  /**
   * Metadatos de todas las categorías, cargados desde `categorias.json`.
   * @type {{ [key: string]: { titulo: string, subtitulo: string } }}
   */
  categoriasData: any = {};

  /**
   * Lista completa de productos, cargada desde `productos.json`.
   * @type {any[]}
   */
  productos: any[] = [];

  /**
   * Categoría actualmente activa según `slug`. Es `null` si no coincide con `categoriasData`.
   * @type {{ titulo: string, subtitulo: string } | null}
   */
  categoriaActual: any = null;

  /**
   * Lista de productos que pertenecen a la categoría actual.
   * Se limita a 3 productos como máximo.
   * @type {any[]}
   */
  productosFiltrados: any[] = [];

  /**
   * Inyecta dependencias necesarias.
   * @param route Ruta activada, usada para extraer el `slug`.
   * @param cart Servicio de carrito para agregar productos.
   * @param jsonSrv Servicio para consumir archivos JSON locales.
   */
  constructor(private route: ActivatedRoute, private cart: Cart, private jsonSrv: JsonService) {}

  /**
   * Inicializa el componente:
   * - Carga `categoriasData` y `productos` desde JSON local.
   * - Escucha el `slug` de la ruta para calcular `categoriaActual` y productos asociados.
   * @returns {void}
   */
  ngOnInit(): void {
    let categoriasListas = false;
    let productosListos = false;

    this.jsonSrv.getCategorias().subscribe({
      next: (data) => {
        this.categoriasData = data;
        categoriasListas = true;
        if (this.slug) this.actualizarVista();
      },
      error: () => console.error('Error cargando categorias.json'),
    });

    this.jsonSrv.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        productosListos = true;
        if (this.slug) this.actualizarVista();
      },
      error: () => console.error('Error cargando productos.json'),
    });

    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      if (categoriasListas && productosListos) {
        this.actualizarVista();
      }
    });
  }

  /**
   * Calcula los productos filtrados y la categoría activa.
   */
  actualizarVista(): void {
    this.categoriaActual = this.categoriasData[this.slug] ?? null;
    this.productosFiltrados = this.productos.filter((p) => p.categoria === this.slug).slice(0, 3);
  }
  /**
   * Agrega un producto al carrito con cantidad 1.
   * @param p Producto a agregar al carrito.
   * @returns {void}
   */
  agregarProducto(p: any): void {
    this.cart.agregar({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      cantidad: 1,
    });
  }
}
