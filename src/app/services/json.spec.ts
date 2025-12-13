import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { JsonService } from './json';
import { ToastComponent } from '../shared/toast/toast';
import { Usuario } from '../core/auth';
import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';

/**
 * Mock simple del componente Toast.
 * Evita dependencias visuales en pruebas unitarias.
 */
class MockToast {
  showError = jasmine.createSpy('showError');
}

describe('JsonService', () => {
  let service: JsonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JsonService,
        provideHttpClient(), // ✅ Reemplazo moderno
        provideHttpClientTesting(), // ✅ Testing HTTP moderno
        { provide: ToastComponent, useClass: MockToast },
      ],
    });

    service = TestBed.inject(JsonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener tipo de cambio con éxito', () => {
    const mockResponse = {
      base: 'USD',
      date: '2025-12-12',
      rates: { CLP: 900 },
    };

    service.getCambioDolar().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://api.exchangerate-api.com/v4/latest/USD');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería manejar error en getCambioDolar', () => {
    service.getCambioDolar().subscribe((data) => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne('https://api.exchangerate-api.com/v4/latest/USD');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('debería obtener ventas con éxito', () => {
    const mockVentas = [{ categoria: 'estrategia', ventas: 125 }];

    service.getVentas().subscribe((data) => {
      expect(data).toEqual(mockVentas);
    });

    const req = httpMock.expectOne('https://patrsilvag.github.io/api-ventas/ventas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockVentas);
  });

  it('debería obtener categorías con éxito', () => {
    const mockCategorias: Record<string, Categoria> = {
      estrategia: {
        titulo: 'Estrategia',
        subtitulo: 'Piensa y gana',
      },
    };

    service.getCategorias().subscribe((data) => {
      expect(data).toEqual(mockCategorias);
    });

    const req = httpMock.expectOne('assets/data/categorias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategorias);
  });

  it('debería obtener productos con éxito', () => {
    const mockProductos: Producto[] = [
      {
        id: 'sku-001',
        nombre: 'Catan',
        categoria: 'estrategia',
        precio: 29990,
        descuento: true,
        imagen: 'assets/img/catan.webp',
        alt: 'Catan',
        desc: 'Coloniza la isla',
      },
    ];

    service.getProductos().subscribe((data) => {
      expect(data).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('assets/data/productos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('debería obtener usuarios remotos con éxito', () => {
    const mockUsuarios: Usuario[] = [
      {
        nombre: 'Juan',
        usuario: 'juan123',
        correo: 'juan@example.com',
        fechaNacimiento: '1990-01-01',
        direccion: 'Calle Falsa 123',
        clave: '1234',
        rol: 'cliente',
        status: 'active',
      },
    ];

    service.getUsuariosRemotos().subscribe((data) => {
      expect(data).toEqual(mockUsuarios);
    });

    const req = httpMock.expectOne('https://patrsilvag.github.io/api-usuarios/usuarios.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
  });
});
