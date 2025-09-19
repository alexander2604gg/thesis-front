import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService, PostResponseDto } from './posts.service';
import { LotesService } from '../configuraciones-registradas/lotes.service';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../core/layout/navbar/navbar";

@Component({
  selector: 'app-posts-analizados',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './posts-analizados.component.html',
  styleUrls: ['./posts-analizados.component.css']
})
export class PostsAnalizadosComponent implements OnInit {
  posts: PostResponseDto[] = [];
  idLote: number = 0;
  cargando: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private lotesService: LotesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idLote = +params['idLot'];
      this.cargarPosts();
    });
  }

  cargarPosts(): void {
    this.cargando = true;
    this.error = '';
    
    this.postsService.obtenerPostsPorLote(this.idLote).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los posts';
        this.cargando = false;
        console.error('Error:', error);
      }
    });
  }

  tieneDepresion(depressionScore: number): boolean {
    return depressionScore > 0.95;
  }

  obtenerEstadoDepresion(depressionScore: number): string {
    return this.tieneDepresion(depressionScore) ? 'Depresión detectada' : 'No tiene depresión';
  }

  obtenerClaseEstado(depressionScore: number): string {
    return this.tieneDepresion(depressionScore) ? 'depresion-detectada' : 'no-depresion';
  }

  obtenerPostsConDepresion(): number {
    return this.posts.filter(post => post.analysis && this.tieneDepresion(post.analysis.depressionScore)).length;
  }

  obtenerPorcentajeDepresion(): string {
    const postsConAnalisis = this.posts.filter(post => post.analysis).length;
    if (postsConAnalisis === 0) return '0.0';
    const conDepresion = this.obtenerPostsConDepresion();
    return ((conDepresion / postsConAnalisis) * 100).toFixed(1);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  volver(): void {
    // Obtener el configId desde el historial de navegación o usar un valor por defecto
    const navigation = this.router.getCurrentNavigation();
    const state = window.history.state;
    
    if (state && state.configId) {
      this.router.navigate(['/lotes', state.configId]);
    } else {
      // Fallback: navegar a configuraciones registradas
      this.router.navigate(['/configuraciones-registradas']);
    }
  }
}