import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, UsuarioAdmin } from './admin.service';
import { Json } from '../../services/json';

/**
 * @description
 * Panel de administración para gestionar usuarios (listar, filtrar, activar/desactivar)
 * y mostrar las ventas por categoría cargadas desde un JSON externo publicado en GitHub Pages.
 *
 * @usageNotes
 * - Usa `AdminService` para la lógica de usuarios y `Json` para consumo de API externa.
 * - El formulario de filtro es reactivo y responde a cambios automáticamente.
 * - Los datos de ventas se muestran como una segunda grilla en la vista.
 *
 * @example
 * <app-admin></app-admin>
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminComponent implements OnInit {
  /**
   * Formulario reactivo con campos `correo`, `rol` y `estado` para filtrar usuarios.
   * @type {FormGroup}
   */
  filtroForm!: FormGroup;

  /**
   * Lista completa de usuarios sin filtrar.
   * @type {UsuarioAdmin[]}
   */
  usuarios: UsuarioAdmin[] = [];

  /**
   * Lista filtrada de usuarios mostrados en la tabla.
   * @type {UsuarioAdmin[]}
   */
  usuariosFiltrados: UsuarioAdmin[] = [];

  /**
   * Lista de ventas por categoría obtenida desde JSON externo.
   * @type {{ categoria: string, ventas: number }[]}
   */
  ventas: any[] = [];

  /**
   * Mensaje de error para ventas.
   * @type {string | null}
   */
  ventasError: string | null = null;

  /**
   * Mensaje de error para errores generales.
   * @type {string | null}
   */
  error: string | null = null;

  /**
   * Bandera de depuración.
   * @type {boolean}
   */
  debug = false;

  /**
   * Inyecta dependencias necesarias para el componente.
   * @param fb Creador de formularios reactivos.
   * @param adminSrv Servicio que gestiona lógica de usuarios.
   * @param jsonSrv Servicio para obtener datos JSON externos.
   */
  constructor(private fb: FormBuilder, private adminSrv: AdminService, private jsonSrv: Json) {}

  /**
   * Inicializa formulario, carga usuarios y ventas desde servicios correspondientes.
   * @returns {void}
   */
  ngOnInit(): void {
    // Formulario reactivo
    this.filtroForm = this.fb.group({
      correo: ['', [Validators.email]],
      rol: [''],
      estado: [''],
    });

    // Cargar usuarios
    this.usuarios = this.adminSrv.cargarUsuarios();
    this.usuariosFiltrados = [...this.usuarios];

    // Suscribirse a filtros
    this.filtroForm.valueChanges.subscribe(() => this.filtrar());

    // Cargar ventas desde JSON externo
    this.jsonSrv.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
      },
      error: (err) => {
        this.ventasError = 'No se pudieron cargar las ventas.';
        console.error(err);
      },
    });
  }

  /**
   * Aplica filtros del formulario a la lista de usuarios.
   * @returns {void}
   */
  filtrar(): void {
    this.usuariosFiltrados = this.adminSrv.filtrarUsuarios(this.usuarios, this.filtroForm.value);
  }

  /**
   * Restablece el formulario de filtros.
   * @returns {void}
   */
  resetFiltro(): void {
    this.filtroForm.reset();
  }

  /**
   * Alterna el estado activo/inactivo de un usuario y actualiza la vista.
   * @param usuario Usuario sobre el que se desea cambiar estado
   * @returns {void}
   */
  toggleEstado(usuario: UsuarioAdmin): void {
    const ok = this.adminSrv.toggleEstado(usuario);
    if (!ok) {
      this.error = 'No se pudo actualizar el estado del usuario.';
      return;
    }
    this.filtrar();
  }
}
