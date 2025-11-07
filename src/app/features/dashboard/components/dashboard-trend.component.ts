import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { TrendPoint } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-trend',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="card">
      <div class="header">
        <h3>Tendencia temporal</h3>
      </div>
      <div *ngIf="loading" class="loading"><div class="spinner"></div><p>Cargando...</p></div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <canvas baseChart
        *ngIf="!loading && !error"
        [data]="chartData"
        [type]="chartType"
        [options]="chartOptions">
      </canvas>
    </div>
  `,
  styleUrls: ['./dashboard-trend.component.css']
})
export class DashboardTrendComponent implements OnChanges {
  constructor() {
    Chart.register(...registerables);
  }
  @Input() data: TrendPoint[] = [];
  @Input() loading: boolean = false;
  @Input() error: string = '';

  chartType: ChartType = 'line';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Promedio', tension: 0.3, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.15)', fill: true }] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: {
      x: { ticks: { autoSkip: true }, title: { display: true, text: 'Fecha' } },
      y: { min: 0, max: 1, title: { display: true, text: 'Puntuación promedio (0–1)' } }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const labels = this.data.map(p => new Date(p.date).toLocaleDateString('es-ES'));
      const values = this.data.map(p => p.avgScore);
      this.chartData = { labels, datasets: [{ data: values, label: 'Promedio', tension: 0.3, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.15)', fill: true }] };
    }
  }
}