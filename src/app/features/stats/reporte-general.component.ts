import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { StatsService, DepressionStatsDto } from './stats.service';
import { ConfiguracionesRegistradasService, ForumConfigResponseDto } from '../configuraciones-registradas/configuraciones-registradas.service';
import { Navbar } from '../../core/layout/navbar/navbar';

Chart.register(...registerables);

@Component({
  selector: 'app-reporte-general',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './reporte-general.component.html',
  styleUrl: './reporte-general.component.css'
})
export class ReporteGeneralComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  configId!: number;
  configuracion?: ForumConfigResponseDto;
  stats?: DepressionStatsDto;
  chart?: Chart;
  cargando = false;
  error = '';
  viewInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private statsService: StatsService,
    private configuracionesService: ConfiguracionesRegistradasService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.configId = +params['id'];
      this.cargarDatos();
    });
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      if (this.stats) {
        this.crearGrafico();
      }
    }, 100);
  }

  cargarDatos() {
    this.cargando = true;
    this.error = '';
    
    // Cargar configuración y estadísticas en paralelo
    Promise.all([
      this.configuracionesService.obtenerConfiguracionPorId(this.configId).toPromise(),
      this.statsService.getDepressionStatsByForumConfig(this.configId).toPromise()
    ]).then(([configuracion, stats]) => {
      this.configuracion = configuracion;
      this.stats = stats;
      // Intentar crear el gráfico con un pequeño delay
      setTimeout(() => {
        this.crearGrafico();
      }, 200);
      this.cargando = false;
    }).catch(err => {
      console.error('Error al cargar datos:', err);
      this.error = 'Error al cargar los datos del reporte';
      this.cargando = false;
    });
  }

  crearGrafico() {
    console.log('Intentando crear gráfico...');
    console.log('Stats:', this.stats);
    console.log('ChartCanvas:', this.chartCanvas);
    
    if (!this.stats || !this.chartCanvas) {
      console.log('No se puede crear el gráfico: stats o chartCanvas no disponibles');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('No se pudo obtener el contexto 2D del canvas');
      return;
    }
    
    console.log('Contexto 2D obtenido correctamente');

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.stats.weeklyStats.map(stat => stat.dayOfWeek);
    const data = this.stats.weeklyStats.map(stat => stat.depressivePosts);
    
    console.log('Labels:', labels);
    console.log('Data:', data);

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Casos Positivos',
          data: data,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Gráfico Lineal de Tendencia - Evolución de Casos Positivos',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Casos Positivos'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Días de la Semana'
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    console.log('Gráfico creado exitosamente:', this.chart);
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
    return interval === 1 ? 'Cada hora' : `Cada ${interval} horas`;
  }

  volver() {
    this.router.navigate(['/lotes', this.configId]);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}