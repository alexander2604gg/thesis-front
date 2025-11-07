import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { DistributionBucket } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-distribution',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="card">
      <div class="header"><h3>Distribución de niveles</h3></div>
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
  styleUrls: ['./dashboard-distribution.component.css']
})
export class DashboardDistributionComponent implements OnChanges {
  constructor() {
    Chart.register(...registerables);
  }
  @Input() data: DistributionBucket[] = [];
  @Input() loading: boolean = false;
  @Input() error: string = '';

  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Cantidad', backgroundColor: '#667eea' }] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: {
      x: { title: { display: true, text: 'Nivel de depresión' } },
      y: { beginAtZero: true, title: { display: true, text: 'Cantidad de posts' } }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const labels = this.data.map(b => b.range);
      const values = this.data.map(b => b.count);
      this.chartData = { labels, datasets: [{ data: values, label: 'Cantidad', backgroundColor: '#667eea' }] };
    }
  }
}