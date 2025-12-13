/**
 * Interfaz que representa un producto del catálogo.
 *
 * @usageNotes
 * Se utiliza en listados, vistas por categoría y en el carrito de compras.
 */
export interface Producto {
  /** Identificador único del producto (SKU). */
  id: string;

  /** Nombre del producto mostrado en la interfaz. */
  nombre: string;

  /** Categoría a la que pertenece el producto. */
  categoria: string;

  /** Precio unitario del producto en pesos chilenos. */
  precio: number;

  /** Indica si el producto tiene descuento aplicado. */
  descuento: boolean;

  /** Ruta de la imagen del producto. */
  imagen: string;

  /** Texto alternativo de la imagen para accesibilidad. */
  alt: string;

  /** Descripción corta del producto mostrada al usuario. */
  desc: string;
}
