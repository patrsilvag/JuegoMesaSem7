import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { ToastComponent } from './shared/toast/toast';
import { AuthService } from './core/auth.service';

/**
 * @description Componente raíz de la aplicación. Orquesta el layout principal
 * (navbar, contenido de rutas y footer).
 * @usageNotes
 * Se declara una sola vez como root component en `main.ts`.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  private authService = inject(AuthService);

  constructor() {
    this.authService.initUsuarios();
  }
}
