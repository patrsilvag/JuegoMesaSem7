import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JsonService } from '../../services/json';
import { HomeCategoria } from '../../models/home-categoria';


/**
 * Página de inicio. Muestra el listado de categorías disponibles
 * y enlaza a las rutas de detalle de categoría.
 * @usageNotes
 * Se usa como ruta raíz (`path: ''`). Cada elemento de `categorias` debe tener
 * al menos `nombre`, `slug` (usado en `/categorias/:slug`) e `imagen`.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  /**
   * Listado de categorías visibles en la portada con los datos
   * necesarios para construir las tarjetas de navegación.
   * @type {{ nombre: string, slug: string, imagen: string }[]}
   */
  //categorias: any[] = [];
  categorias: HomeCategoria[] = [];

  /**
   * Inyecta el servicio JSON para cargar datos de assets.
   * @param jsonSrv Servicio de acceso a archivos JSON locales.
   */
  constructor(private jsonSrv: JsonService) {}

  /**
   * Carga las categorías desde el archivo `categorias.json`.
   * @returns {void}
   */
  ngOnInit(): void {
    this.jsonSrv.getCategorias().subscribe({
      next: (data) => {
        // Convertir el objeto en array con clave como slug
        this.categorias = Object.entries(data).map(([slug, info]: [string, any]) => ({
          nombre: info.titulo,
          slug,
          imagen: `assets/img/categorias/${slug}.webp`,
        }));
      },
      error: () => console.error('No se pudo cargar categorias.json'),
    });
  }
}
