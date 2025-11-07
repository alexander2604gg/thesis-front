import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService, PostResponseDto } from './posts.service';
import { LotesService } from '../configuraciones-registradas/lotes.service';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../core/layout/navbar/navbar";
import { RecommendationService } from './recommendation.service';

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
  // Estado por post para recomendaciones
  recomendaciones: { [postId: number]: { texto: string | null, cargando: boolean, error: string } } = {};
  // Estado de envío por post
  envios: { [postId: number]: { cargando: boolean, resultado: string, error: string } } = {};
  modalPostId: number | null = null;
  // Modal de texto completo del post
  modalTextoPost: PostResponseDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private lotesService: LotesService,
    private recommendationService: RecommendationService
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
        // Inicializar estado de recomendaciones para cada post cargado
        posts.forEach(p => {
          if (!this.recomendaciones[p.id]) {
            this.recomendaciones[p.id] = { texto: null, cargando: false, error: '' };
          }
        });
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los posts';
        this.cargando = false;
        console.error('Error:', error);
      }
    });
  }

  tieneDepresion(label: string): boolean {
    return label === 'LABEL_1';
  }

  obtenerEstadoDepresion(label: string): string {
    return this.tieneDepresion(label) ? 'Depresión detectada' : 'No tiene depresión';
  }

  obtenerClaseEstado(label: string): string {
    return this.tieneDepresion(label) ? 'depresion-detectada' : 'no-depresion';
  }

  formatearPorcentajeDepresion(score: number | null | undefined): string {
    if (score == null) return '0.0%';
    const pct = Math.max(0, Math.min(1, score)) * 100;
    return pct.toFixed(1) + '%';
  }

  obtenerPostsConDepresion(): number {
    return this.posts.filter(post => post.analysis && this.tieneDepresion(post.analysis.label)).length;
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

  abrirModalTexto(post: PostResponseDto): void {
    this.modalTextoPost = post;
  }

  cerrarModalTexto(): void {
    this.modalTextoPost = null;
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

  solicitarRecomendacion(post: PostResponseDto): void {
    // Inicializar estado para el post y abrir modal
    this.modalPostId = post.id;
    const yaTiene = (post.recommendation && post.recommendation.trim().length > 0);
    if (yaTiene) {
      this.recomendaciones[post.id] = { texto: post.recommendation!, cargando: false, error: '' };
      return;
    }
    this.recomendaciones[post.id] = { texto: null, cargando: true, error: '' };
    this.recommendationService.askRecommendation(post.id).subscribe({
      next: (texto: string) => {
        this.recomendaciones[post.id] = {
          texto: texto || 'No se obtuvo una recomendación.',
          cargando: false,
          error: ''
        };
      },
      error: (err) => {
        console.error('Error obteniendo recomendación del backend:', err);
        this.recomendaciones[post.id] = {
          texto: null,
          cargando: false,
          error: 'Error al obtener la recomendación.'
        };
      }
    });
  }

  enviarRecomendacion(post: PostResponseDto): void {
    this.envios[post.id] = { cargando: true, resultado: '', error: '' };
    this.recommendationService.sendRecommendation({ postId: post.id }).subscribe({
      next: (res: string) => {
        this.envios[post.id] = { cargando: false, resultado: res || 'Mensaje enviado', error: '' };
        // Marcar como enviado para ocultar el botón
        post.messageSent = true;
      },
      error: (err) => {
        console.error('Error enviando recomendación por Reddit:', err);
        const mensaje = this.extraerMensajeError(err);
        this.envios[post.id] = { cargando: false, resultado: '', error: mensaje };
      }
    });
  }

  private extraerMensajeError(err: any): string {
    const porDefecto = 'Ocurrió un error al enviar';
    if (!err) return porDefecto;
    const e = err.error;
    if (typeof e === 'string') {
      try {
        const obj = JSON.parse(e);
        return obj?.message || porDefecto;
      } catch {
        return e;
      }
    }
    if (e && typeof e === 'object' && 'message' in e) {
      return (e as any).message || porDefecto;
    }
    return err.message || porDefecto;
  }

  cerrarModal(): void {
    this.modalPostId = null;
  }
}