import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Navbar } from '../../../core/layout/navbar/navbar';
import { DashboardService, DashboardOverview, TrendPoint, DistributionBucket, CriticalPost } from '../services/dashboard.service';
import { DashboardAllPostsComponent } from '../components/dashboard-all-posts.component';
import { AllPost } from '../types/all-posts';
import { DashboardOverviewComponent } from '../components/dashboard-overview.component';
import { DashboardTrendComponent } from '../components/dashboard-trend.component';
import { DashboardDistributionComponent } from '../components/dashboard-distribution.component';
import { DashboardCriticalPostsComponent } from '../components/dashboard-critical-posts.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar, DashboardOverviewComponent, DashboardTrendComponent, DashboardDistributionComponent, DashboardCriticalPostsComponent, DashboardAllPostsComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  // Filtro reactivo
  filtros!: FormGroup;
  // Vista activa de gráficos
  chartView: 'trend' | 'distribution' = 'trend';
  // Vista activa de sección
  sectionView: 'general' | 'analytics' | 'posts' = 'general';

  // Estados y datos
  overview: DashboardOverview | null = null;
  loadingOverview = false; errorOverview = '';

  trendData: TrendPoint[] = []; loadingTrend = false; errorTrend = '';
  distributionData: DistributionBucket[] = []; loadingDistribution = false; errorDistribution = '';
  criticalPosts: CriticalPost[] = []; loadingCritical = false; errorCritical = '';
  allPosts: AllPost[] = []; loadingAll = false; errorAll = '';

  constructor(private fb: FormBuilder, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Inicializar filtros una vez disponible FormBuilder
    this.filtros = this.fb.group({
      subreddit: [''],
      start: [this.formatDateInput(this.daysAgo(7))],
      end: [this.formatDateInput(new Date())]
    });
    this.cargarOverview();
    this.cargarCriticalPosts();
    this.aplicarFiltros();
  }

  setChartView(view: 'trend' | 'distribution'): void {
    this.chartView = view;
  }

  setSectionView(view: 'general' | 'analytics' | 'posts'): void {
    this.sectionView = view;
    if (view === 'posts' && this.allPosts.length === 0 && !this.loadingAll) {
      this.cargarAllPosts();
    }
  }

  aplicarFiltros(): void {
    const { subreddit, start, end } = this.filtros.value;
    this.cargarTrend(subreddit || '', start || '', end || '');
    this.cargarDistribution(subreddit || '');
  }

  private cargarOverview(): void {
    this.loadingOverview = true; this.errorOverview = '';
    this.dashboardService.getOverview().subscribe({
      next: (data) => { this.overview = data; this.loadingOverview = false; },
      error: () => { this.errorOverview = 'Error al cargar el resumen'; this.loadingOverview = false; }
    });
  }

  private cargarTrend(subreddit: string, start: string, end: string): void {
    this.loadingTrend = true; this.errorTrend = ''; this.trendData = [];
    this.dashboardService.getTrend(subreddit, start, end).subscribe({
      next: (data) => { this.trendData = data; this.loadingTrend = false; },
      error: () => { this.errorTrend = 'Error al cargar la tendencia'; this.loadingTrend = false; }
    });
  }

  private cargarDistribution(subreddit: string): void {
    this.loadingDistribution = true; this.errorDistribution = ''; this.distributionData = [];
    this.dashboardService.getDistribution(subreddit).subscribe({
      next: (data) => { this.distributionData = data; this.loadingDistribution = false; },
      error: () => { this.errorDistribution = 'Error al cargar la distribución'; this.loadingDistribution = false; }
    });
  }

  private cargarCriticalPosts(): void {
    this.loadingCritical = true; this.errorCritical = ''; this.criticalPosts = [];
    // Valores por defecto
    const threshold = 0.9, limit = 50;
    this.dashboardService.getCriticalPosts(threshold, limit).subscribe({
      next: (data) => { this.criticalPosts = data; this.loadingCritical = false; },
      error: () => { this.errorCritical = 'Error al cargar posts críticos'; this.loadingCritical = false; }
    });
  }

  private cargarAllPosts(): void {
    this.loadingAll = true; this.errorAll = ''; this.allPosts = [];
    this.dashboardService.getAllAnalyzedPosts(0, 20).subscribe({
      next: (resp) => { this.allPosts = resp?.content || []; this.loadingAll = false; },
      error: () => { this.errorAll = 'Error al cargar post totales'; this.loadingAll = false; }
    });
  }

  // Helpers fecha
  private formatDateInput(d: Date): string { return d.toISOString().slice(0,10); }
  private daysAgo(n: number): Date { const d = new Date(); d.setDate(d.getDate() - n); return d; }
}