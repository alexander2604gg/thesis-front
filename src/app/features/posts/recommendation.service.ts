import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.tokens';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/recommendation`;
  }

  askRecommendation(postId: number): Observable<string> {
    const url = `${this.apiUrl}/ask`;
    const params = new HttpParams().set('postId', String(postId));
    return this.http.post(url, null, { params, responseType: 'text' });
  }

  sendRecommendation(dto: { postId: number; to?: string; subject?: string }): Observable<string> {
    const url = `${this.baseUrl}/api/reddit/message/recommendation`;
    return this.http.post(url, dto, { responseType: 'text' });
  }
}