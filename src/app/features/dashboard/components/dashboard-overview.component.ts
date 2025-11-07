import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardOverview } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview-grid">
      <div class="card" *ngIf="loading; else content">
        <div class="skeleton"></div>
      </div>
      <ng-template #content>
        <div class="card">
          <div class="metric">
            <span class="label">Total de Posts</span>
            <span class="value">{{ overview?.totalPosts ?? 0 }}</span>
          </div>
        </div>
        <div class="card">
          <div class="metric">
            <span class="label">Promedio de Depresión</span>
            <span class="value">{{ (overview?.averageDepressionScore ?? 0) | number:'1.2-2' }}</span>
          </div>
        </div>
        <div class="card">
          <div class="metric">
            <span class="label">Subreddit más crítico</span>
            <span class="value">{{ overview?.mostDepressedSubreddit || '-' }}</span>
          </div>
        </div>
        <div class="card">
          <div class="metric">
            <span class="label">Subreddits activos</span>
            <span class="value">{{ overview?.totalSubredditsActive ?? 0 }}</span>
          </div>
        </div>
        <div class="card">
          <div class="metric">
            <span class="label">Último análisis</span>
            <span class="value">{{ overview?.lastAnalysisDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
      </ng-template>
      <div class="card error" *ngIf="error">
        <span>{{ error }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent {
  @Input() overview: DashboardOverview | null = null;
  @Input() loading: boolean = false;
  @Input() error: string = '';
}