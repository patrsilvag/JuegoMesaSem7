/**
 * Interfaz que representa los metadatos de una categoría de productos.
 *
 * @usageNotes
 * Se utiliza para mostrar títulos y subtítulos en las vistas
 * de categorías y en el home.
 */
export interface Categoria {
  /** Título principal de la categoría mostrado en la interfaz. */
  titulo: string;

  /** Texto descriptivo que acompaña al título de la categoría. */
  subtitulo: string;
}
