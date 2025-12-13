/**
 * Interfaz que representa una venta registrada.
 *
 * @usageNotes
 * Se utiliza al consumir el JSON externo de ventas
 * publicado en GitHub Pages.
 */
export interface Venta {
  /** Categoría del producto vendido. */
  categoria: string;
  /** Cantidad de unidades vendidas. */
  ventas: number;
}
