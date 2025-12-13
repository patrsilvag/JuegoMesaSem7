/**
 * Interfaz que representa la respuesta de la API de tipo de cambio.
 *
 * @usageNotes
 * Se utiliza para tipar la respuesta obtenida desde la API externa
 * de conversión de divisas.
 */
export interface ExchangeRateResponse {
  /** Moneda base utilizada para la conversión (por ejemplo, USD). */
  base: string;

  /** Fecha asociada a la tasa de cambio entregada por la API. */
  date: string;

  /**
   * Conjunto de tasas de cambio indexadas por código de moneda.
   * Ejemplo: CLP, EUR, ARS, etc.
   */
  rates: {
    [currency: string]: number;
  };
}
