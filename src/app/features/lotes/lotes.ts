import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../core/layout/navbar/navbar';
import { LotesService, LotResponseDto } from '../configuraciones-registradas/lotes.service';
import { ConfiguracionesRegistradasService, ForumConfigResponseDto } from '../configuraciones-registradas/configuraciones-registradas.service';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './lotes.html',
  styleUrl: './lotes.css'
})
export class Lotes implements OnInit {
  configId!: number;
  configuracion?: ForumConfigResponseDto;
  lotes: LotResponseDto[] = [];
  lotesFiltrados: LotResponseDto[] = [];
  fechaFiltro: string = '';
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lotesService: LotesService,
    private configuracionesService: ConfiguracionesRegistradasService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.configId = +params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.cargando = true;
    let configuracionCargada = false;
    let lotesCargados = false;
    
    const verificarCargaCompleta = () => {
      if (configuracionCargada && lotesCargados) {
        this.cargando = false;
      }
    };
    
    // Cargar información de la configuración
    this.configuracionesService.obtenerConfiguracionPorId(this.configId)
      .subscribe({
        next: (configuracion) => {
          this.configuracion = configuracion;
          configuracionCargada = true;
          verificarCargaCompleta();
        },
        error: (err) => {
          console.error('Error al cargar configuración:', err);
          configuracionCargada = true;
          verificarCargaCompleta();
        }
      });

    // Cargar lotes
    this.lotesService.obtenerLotesPorConfiguracion(this.configId)
      .subscribe({
        next: (lotes) => {
          this.lotes = lotes;
          this.lotesFiltrados = lotes;
          lotesCargados = true;
          verificarCargaCompleta();
        },
        error: (err) => {
          console.error('Error al cargar lotes:', err);
          lotesCargados = true;
          verificarCargaCompleta();
        }
      });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearPeriodo(interval: number): string {
    return `Cada ${interval} minutos`;
  }

  volver() {
    this.router.navigate(['/configuraciones-registradas']);
  }

  verDetallesLote(loteId: number) {
    this.router.navigate(['/posts-analizados', loteId], {
      state: { configId: this.configId }
    });
  }

  verReporteGeneral() {
    this.router.navigate(['/reporte-general', this.configId]);
  }

  filtrarPorFecha() {
    if (!this.fechaFiltro) {
      this.lotesFiltrados = this.lotes;
      return;
    }

    // Crear fecha UTC para evitar problemas de zona horaria
    const [año, mes, dia] = this.fechaFiltro.split('-').map(Number);
    
    this.lotesFiltrados = this.lotes.filter(lote => {
      const fechaLote = new Date(lote.createdAt);
      
      // Comparar usando los valores directos del input
      return fechaLote.getFullYear() === año &&
             fechaLote.getMonth() === (mes - 1) && // getMonth() devuelve 0-11
             fechaLote.getDate() === dia;
    });
  }
}