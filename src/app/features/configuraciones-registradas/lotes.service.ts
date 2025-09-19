import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LotResponseDto {
  id: number;
  createdAt: string;
  sizePosts: number;
  sizePostsDepression: number;
  configId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LotesService {
  private baseUrl = 'http://localhost:8080/api/lot';

  constructor(private http: HttpClient) {}

  obtenerLotesPorConfiguracion(idConfig: number): Observable<LotResponseDto[]> {
    return this.http.get<LotResponseDto[]>(`${this.baseUrl}/by-config/${idConfig}`);
  }

  obtenerLotePorId(idLot: number): Observable<LotResponseDto> {
    return this.http.get<LotResponseDto>(`${this.baseUrl}/${idLot}`);
  }
}