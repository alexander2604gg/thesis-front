import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.tokens';

export interface Analysis {
  id: number;
  depressionScore: number;
  modelVersion: string;
  analyzedAt: string;
  label: string
}

export interface PostResponseDto {
  id: number;
  redditId: string;
  author?: string;
  title: string;
  content: string;
  createdAtReddit: string;
  fetchedAt: string;
  recommendation?: string | null;
  messageSent?: boolean;
  analysis: Analysis;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/posts`;
  }

  obtenerPostsPorLote(idLot: number): Observable<PostResponseDto[]> {
    return this.http.get<PostResponseDto[]>(`${this.apiUrl}/${idLot}`);
  }
}