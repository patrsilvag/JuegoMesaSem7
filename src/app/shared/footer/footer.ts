import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonService } from '../../services/json';

/**
 * 
 * Componente de pie de página. Muestra contenido estático del sitio como créditos
 * y derechos reservados, además de información dinámica como el tipo de cambio
 * de dólar estadounidense (USD) a peso chileno (CLP).
 *
 * @usageNotes
 * Este componente es standalone, por lo que debe importar `CommonModule`
 * para usar directivas como `*ngIf` y `*ngFor`.
 * Obtiene el tipo de cambio desde una API externa usando el servicio `Json`.
 *
 * API usada:
 * https://api.exchangerate-api.com/v4/latest/USD
 *
 * Se recomienda incluirlo una sola vez en la plantilla principal.
 *
 * Ejemplo:
 * `<app-footer></app-footer>`
 *
 * @param jsonService Servicio inyectado que maneja la llamada HTTP a la API real.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent implements OnInit {
  /**
   * Valor actual del tipo de cambio de USD a CLP.
   * Se obtiene dinámicamente desde la API externa al inicializar el componente.
   * Es `null` mientras no se haya cargado o si ocurre un error.
   * @type {number | null}
   */
  valorDolar: number | null = null;

  /**
   * Crea una instancia del componente e inyecta el servicio `Json`.
   *
   * @param jsonService Servicio inyectado que maneja la llamada HTTP a la API real.
   */
  constructor(private jsonService: JsonService) {}
  /**
   * Inicializa el componente y solicita el tipo de cambio desde la API externa.
   * El valor se guarda en `valorDolar`. Si ocurre un error, se asigna `null`.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.jsonService.getCambioDolar().subscribe({
      next: (data) => {
        this.valorDolar = data?.rates?.CLP ?? null;
      },
      error: (err) => {
        console.error('Error al obtener tipo de cambio', err);
        this.valorDolar = null;
      },
    });
  }
}