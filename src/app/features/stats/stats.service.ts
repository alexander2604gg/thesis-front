import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.tokens';

export interface WeeklyStat {
  dayOfWeek: string;
  depressivePosts: number;
}

export interface DepressionStatsDto {
  totalPosts: number;
  totalDepressivePosts: number;
  percentageDepressive: number;
  weeklyStats: WeeklyStat[];
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/stats`;
  }

  getDepressionStatsByForumConfig(forumConfigId: number): Observable<DepressionStatsDto> {
    return this.http.get<DepressionStatsDto>(`${this.apiUrl}/depression/${forumConfigId}`);
  }
}