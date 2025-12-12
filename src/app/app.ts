import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { ToastComponent } from './shared/toast/toast';
import { AuthService } from './core/auth.service';

/**
 * Componente raíz de la aplicación. Orquesta el layout principal
 * (navbar, contenido de rutas y footer).
 * @usageNotes
 * Se declara una sola vez como root component en `main.ts`.
 * Se encarga también de inicializar los datos base, como los usuarios simulados.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  /**
   * Servicio de autenticación global, inyectado mediante `inject()`.
   * Se utiliza para inicializar el sistema de usuarios simulados desde GitHub Pages
   * y sincronizar con localStorage si es necesario.
   */
  private authService = inject(AuthService);

  /**
   * Constructor del componente.
   *
   * ⚠ IMPORTANTE:
   * - Llama a `initUsuarios()` para cargar datos remotos si aún no existen usuarios locales.
   * - Esto asegura que el sistema simulado tenga un usuario admin cargado al iniciar.
   */
  constructor() {
    this.authService.initUsuarios();
  }
}
