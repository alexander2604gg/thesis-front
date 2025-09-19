import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly apiUrl = 'http://localhost:8080/api/stats';

  constructor(private http: HttpClient) {}

  getDepressionStatsByForumConfig(forumConfigId: number): Observable<DepressionStatsDto> {
    return this.http.get<DepressionStatsDto>(`${this.apiUrl}/depression/${forumConfigId}`);
  }
}