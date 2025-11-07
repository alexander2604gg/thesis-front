import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriticalPost } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-critical-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="header"><h3>Posts críticos</h3></div>
      <div *ngIf="loading" class="loading"><div class="spinner"></div><p>Cargando...</p></div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div class="table-wrapper" *ngIf="!loading && !error">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Subreddit</th>
              <th>Score</th>
              <th>Label</th>
              <th>Extracto</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of posts">
              <td>{{ p.date | date:'dd/MM/yyyy' }}</td>
              <td>{{ p.subreddit }}</td>
              <td>{{ p.depressionScore | number:'1.2-2' }}</td>
              <td>{{ p.label }}</td>
              <td class="excerpt">{{ p.excerpt }}</td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="posts.length === 0" class="empty">Sin resultados</div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-critical-posts.component.css']
})
export class DashboardCriticalPostsComponent {
  @Input() posts: CriticalPost[] = [];
  @Input() loading: boolean = false;
  @Input() error: string = '';
}