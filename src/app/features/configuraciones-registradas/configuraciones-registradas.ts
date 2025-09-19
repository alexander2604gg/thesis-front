import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../core/layout/navbar/navbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionesRegistradasService, ForumConfigResponseDto } from './configuraciones-registradas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuraciones-registradas',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './configuraciones-registradas.html',
  styleUrl: './configuraciones-registradas.css',
  standalone: true
})
export class ConfiguracionesRegistradas implements OnInit {

  configuraciones: ForumConfigResponseDto[] = [];
  cargando = false;
  fechaFiltro = '';

  constructor(
    private configuracionesService: ConfiguracionesRegistradasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.inicializarFechaHoy();
    this.cargarConfiguraciones();
  }

  inicializarFechaHoy() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    this.fechaFiltro = `${year}-${month}-${day}`;
  }

  cargarConfiguraciones() {
    if (!this.fechaFiltro) return;
    
    this.cargando = true;
    
    this.configuracionesService.obtenerConfiguracionesPorFecha(this.fechaFiltro)
      .subscribe({
        next: (configuraciones: ForumConfigResponseDto[]) => {
          this.configuraciones = configuraciones;
          this.cargando = false;
        },
        error: (err: any) => {
          console.error('Error al cargar configuraciones:', err);
          this.cargando = false;
        }
      });
  }

  onFechaChange() {
    this.cargarConfiguraciones();
  }

  agregarNueva() {
    this.router.navigate(['/configuracion']);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  }

  formatearPeriodo(interval: number): string {
    return `Cada ${interval} minutos`;
  }



  verLotes(configId: number) {
    this.router.navigate(['/lotes', configId]);
  }

  volver() {
    this.router.navigate(['/configuracion']);
  }
}