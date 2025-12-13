/**
 * Interfaz que define la estructura de una categoría resumida
 * mostrada en la página principal (home).
 *
 * @usageNotes
 * Se usa únicamente para la navegación visual hacia las categorías.
 */
export interface HomeCategoria {
  /** Nombre visible de la categoría en la página principal. */
  nombre: string;

  /** Identificador de la categoría usado en la URL para la navegación. */
  slug: string;
  /** Ruta de la imagen representativa de la categoría. */
  imagen: string;
}
