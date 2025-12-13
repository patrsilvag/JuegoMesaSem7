import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
// Importamos JsonService para poder crear su mock
import { JsonService } from '../services/json';
// Importamos 'of' para simular respuestas de observables
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let jsonSpy: jasmine.SpyObj<JsonService>;

  beforeEach(() => {
    // 1. Creamos un Mock (espía) del JsonService.
    // Incluimos 'getUsuariosRemotos' porque es probable que el AuthService lo llame al iniciarse o al validar usuarios.
    jsonSpy = jasmine.createSpyObj<JsonService>('JsonService', ['getUsuariosRemotos']);

    // 2. Configuramos el Mock para que devuelva un array vacío por defecto.
    // Esto evita errores si el constructor del AuthService intenta suscribirse inmediatamente.
    jsonSpy.getUsuariosRemotos.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // 3. ¡IMPORTANTE! Inyección de dependencias:
        // Cuando AuthService pida 'JsonService', le entregamos nuestro 'jsonSpy'.
        // Esto evita que Angular busque HttpClient y previene el error "No provider found for _HttpClient".
        { provide: JsonService, useValue: jsonSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
