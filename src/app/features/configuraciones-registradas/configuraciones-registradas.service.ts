import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ForumConfigResponseDto {
  id: number;
  subreddit: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  interval: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesRegistradasService {
  private readonly apiUrl = 'http://localhost:8080/api/forum-config';

  constructor(private http: HttpClient) {}

  obtenerConfiguracionesPorFecha(fecha: string): Observable<ForumConfigResponseDto[]> {
    // Convertir fecha a formato requerido por el backend (yyyy-MM-dd'T'HH:mm:ss)
    const fechaConHora = `${fecha}T00:00:00`;
    return this.http.get<ForumConfigResponseDto[]>(`${this.apiUrl}/by-start-date?date=${fechaConHora}`);
  }

  obtenerConfiguracionPorId(id: number): Observable<ForumConfigResponseDto> {
    return this.http.get<ForumConfigResponseDto>(`${this.apiUrl}/${id}`);
  }
}