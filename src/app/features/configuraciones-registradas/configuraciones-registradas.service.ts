import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.tokens';

export interface ForumConfigResponseDto {
  id: number;
  subreddit: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  interval: number;
}

@Injectable({ providedIn: 'root' })
export class ConfiguracionesRegistradasService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/forum-config`;
  }

  obtenerConfiguracionesPorFecha(fecha: string): Observable<ForumConfigResponseDto[]> {
    // Convertir fecha a formato requerido por el backend (yyyy-MM-dd'T'HH:mm:ss)
    const fechaConHora = `${fecha}T00:00:00`;
    return this.http.get<ForumConfigResponseDto[]>(`${this.apiUrl}/by-start-date?date=${fechaConHora}`);
  }

  obtenerConfiguracionPorId(id: number): Observable<ForumConfigResponseDto> {
    return this.http.get<ForumConfigResponseDto>(`${this.apiUrl}/${id}`);
  }
}