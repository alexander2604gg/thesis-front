import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Analysis {
  id: number;
  depressionScore: number;
  modelVersion: string;
  analyzedAt: string;
}

export interface PostResponseDto {
  id: number;
  redditId: string;
  title: string;
  content: string;
  createdAtReddit: string;
  fetchedAt: string;
  analysis: Analysis;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  obtenerPostsPorLote(idLot: number): Observable<PostResponseDto[]> {
    return this.http.get<PostResponseDto[]>(`${this.apiUrl}/${idLot}`);
  }
}