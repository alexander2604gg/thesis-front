import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPost } from '../types/all-posts';

@Component({
  selector: 'app-dashboard-all-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="header"><h3>Post totales</h3></div>
      <div class="filters">
        <div class="field">
          <label>Subreddit</label>
          <input
            class="input"
            type="text"
            [value]="subredditQuery"
            (input)="subredditQuery = $any($event.target).value"
            placeholder="ej: depression" />
        </div>
        <div class="field">
          <label>Score mínimo</label>
          <input
            class="input"
            type="number"
            step="0.01" min="0" max="1"
            [value]="scoreThresholdStr"
            (input)="scoreThresholdStr = $any($event.target).value"
            placeholder="ej: 0.80" />
        </div>
        <button class="btn-clear" (click)="limpiarFiltros()" [disabled]="!subredditQuery && !scoreThresholdStr">Limpiar</button>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div><p>Cargando...</p></div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div class="table-wrapper" *ngIf="!loading && !error">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Subreddit</th>
              <th>Autor</th>
              <th>Score</th>
              <th>Label</th>
              <th>Extracto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPosts">
              <td>{{ p.date | date:'dd/MM/yyyy' }}</td>
              <td>{{ p.subreddit }}</td>
              <td>{{ p.author || '-' }}</td>
              <td>{{ p.depressionScore | number:'1.2-2' }}</td>
              <td>{{ p.label }}</td>
              <td class="excerpt">{{ p.excerpt }}</td>
              <td>
                <button class="btn-ver" (click)="abrirModal(p)">Ver más</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filteredPosts.length === 0" class="empty">Sin resultados</div>
      </div>
    </div>

    <!-- Modal de información completa -->
    <div class="modal-overlay" *ngIf="selectedPost as sp" (click)="cerrarModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Información del post</h3>
          <button class="btn-cerrar" (click)="cerrarModal()">×</button>
        </div>
        <div class="modal-content">
          <div class="modal-grid">
            <div class="item"><span class="label">Fecha</span><span class="value">{{ sp.date | date:'dd/MM/yyyy HH:mm' }}</span></div>
            <div class="item"><span class="label">Subreddit</span><span class="value">{{ sp.subreddit }}</span></div>
            <div class="item"><span class="label">Autor</span><span class="value">u/{{ sp.author || '-' }}</span></div>
            <div class="item"><span class="label">Score</span><span class="value">{{ sp.depressionScore | number:'1.2-2' }}</span></div>
            <div class="item"><span class="label">Label</span><span class="value">{{ sp.label }}</span></div>
          </div>
          <div class="full-text">
            <span class="label">Texto completo</span>
            <div class="text">{{ sp.excerpt }}</div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secundario" (click)="cerrarModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-all-posts.component.css']
})
export class DashboardAllPostsComponent {
  @Input() posts: AllPost[] = [];
  @Input() loading: boolean = false;
  @Input() error: string = '';

  subredditQuery: string = '';
  scoreThresholdStr: string = '';
  selectedPost: AllPost | null = null;

  get filteredPosts(): AllPost[] {
    const q = this.subredditQuery.trim().toLowerCase();
    const t = this.scoreThresholdStr ? parseFloat(this.scoreThresholdStr) : null;
    return (this.posts || []).filter(p => {
      const matchSub = q ? (p.subreddit || '').toLowerCase().includes(q) : true;
      const score = typeof p.depressionScore === 'number' ? p.depressionScore : 0;
      const matchScore = t !== null ? score >= t! : true;
      return matchSub && matchScore;
    });
  }

  limpiarFiltros(): void {
    this.subredditQuery = '';
    this.scoreThresholdStr = '';
  }

  abrirModal(p: AllPost): void { this.selectedPost = p; }
  cerrarModal(): void { this.selectedPost = null; }
}