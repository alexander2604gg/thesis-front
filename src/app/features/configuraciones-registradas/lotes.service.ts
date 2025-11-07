import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.tokens';

export interface LotResponseDto {
  id: number;
  createdAt: string;
  sizePosts: number;
  sizePostsDepression: number;
  configId?: number;
}

@Injectable({ providedIn: 'root' })
export class LotesService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/lot`;
  }

  obtenerLotesPorConfiguracion(idConfig: number): Observable<LotResponseDto[]> {
    return this.http.get<LotResponseDto[]>(`${this.apiUrl}/by-config/${idConfig}`);
  }

  obtenerLotePorId(idLot: number): Observable<LotResponseDto> {
    return this.http.get<LotResponseDto>(`${this.apiUrl}/${idLot}`);
  }
}