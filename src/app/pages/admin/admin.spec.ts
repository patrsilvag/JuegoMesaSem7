import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AdminService, UsuarioAdmin } from './admin.service';
import { JsonService } from '../../services/json'; // Importar el servicio
import { of } from 'rxjs'; // Importar 'of' para observables simulados

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  // 1. Declarar los Spies
  let adminSpy: jasmine.SpyObj<AdminService>;
  let jsonSpy: jasmine.SpyObj<JsonService>;

  const usuariosMock: UsuarioAdmin[] = [
    { correo: 'admin@site.com', usuario: 'Admin', rol: 'admin', status: 'active' },
    { correo: 'user@site.com', usuario: 'User', rol: 'cliente', status: 'inactive' },
    { correo: 'otro@site.com', usuario: 'Otro', rol: 'cliente', status: 'active' },
  ];

  beforeEach(async () => {
    // 2. Configurar el Spy de AdminService (Lógica de usuarios)
    adminSpy = jasmine.createSpyObj<AdminService>('AdminService', [
      'cargarUsuarios',
      'filtrarUsuarios',
      'toggleEstado',
    ]);

    adminSpy.cargarUsuarios.and.callFake(() => usuariosMock.map((u) => ({ ...u })));

    adminSpy.filtrarUsuarios.and.callFake((lista: UsuarioAdmin[], filtros: any) => {
      const { correo, rol, estado } = filtros;
      return lista.filter(
        (u) =>
          (!correo || u.correo.includes(correo)) &&
          (!rol || u.rol === rol) &&
          (!estado || u.status === estado)
      );
    });

    // Corrección importante del turno anterior: toggleEstado debe retornar boolean
    adminSpy.toggleEstado.and.callFake((u: UsuarioAdmin) => {
      u.status = u.status === 'active' ? 'inactive' : 'active';
      return true;
    });

    // 3. Configurar el Spy de JsonService (Lógica de ventas/http)
    // Esto soluciona el error "No provider found for _HttpClient"
    jsonSpy = jasmine.createSpyObj<JsonService>('JsonService', ['getVentas']);
    // Simulamos que devuelve un array vacío o datos de prueba
    jsonSpy.getVentas.and.returnValue(of([{ categoria: 'Test', ventas: 100 }]));

    await TestBed.configureTestingModule({
      imports: [AdminComponent, ReactiveFormsModule],
      // 4. Proveer ambos Spies
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: JsonService, useValue: jsonSpy }, // <--- ESTO FALTABA
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente y el formulario de filtro', () => {
    expect(component).toBeTruthy();
    expect(component.filtroForm).toBeTruthy();
  });

  it('debe cargar usuarios al iniciar', () => {
    expect(adminSpy.cargarUsuarios).toHaveBeenCalled();
    expect(component.usuarios.length).toBe(3);
  });

  it('debe cargar ventas al iniciar (usando el spy de JsonService)', () => {
    expect(jsonSpy.getVentas).toHaveBeenCalled();
    expect(component.ventas.length).toBeGreaterThan(0);
  });

  it('resetFiltro() debe limpiar el formulario', () => {
    component.filtroForm.patchValue({ correo: 'user', rol: 'cliente', estado: 'inactive' });
    component.filtrar(); // simular acción
    component.resetFiltro();

    expect(component.filtroForm.value).toEqual({
      correo: null,
      rol: null,
      estado: null,
    });
  });

  it('debe filtrar por correo', () => {
    component.filtroForm.patchValue({ correo: 'user@site.com' });
    component.filtrar();

    expect(adminSpy.filtrarUsuarios).toHaveBeenCalled();
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].correo).toBe('user@site.com');
  });

  it('debe filtrar por rol', () => {
    component.filtroForm.patchValue({ rol: 'admin' });
    component.filtrar();

    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].rol).toBe('admin');
  });

  it('debe filtrar por estado', () => {
    component.filtroForm.setValue({
      correo: '',
      rol: '',
      estado: 'inactive',
    });
    component.filtrar();

    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].status).toBe('inactive');
  });

  it('toggleEstado(u) debe llamar al servicio y actualizar la vista', () => {
    // Obtenemos una referencia al primer usuario filtrado
    const u = component.usuariosFiltrados[0];
    const estadoInicial = u.status;

    // Llamamos al método del componente (que devuelve void)
    component.toggleEstado(u);

    // Verificamos que se llamó al servicio con ese usuario
    expect(adminSpy.toggleEstado).toHaveBeenCalledWith(u);

    // Verificamos que el estado del objeto cambió (gracias al callFake que modifica la referencia)
    expect(u.status).not.toBe(estadoInicial);
  });

  it('template: debe mostrar tabla si hay usuariosFiltrados', () => {
    fixture.detectChanges();
    const tabla = fixture.debugElement.query(By.css('table'));
    expect(tabla).toBeTruthy();
  });

  it('template: debe mostrar mensaje de alerta cuando no hay resultados', () => {
    // Forzamos lista vacía
    component.usuariosFiltrados = [];
    fixture.detectChanges();

    const info = fixture.debugElement.query(By.css('.alert-info'));
    expect(info).toBeTruthy();
  });
});
