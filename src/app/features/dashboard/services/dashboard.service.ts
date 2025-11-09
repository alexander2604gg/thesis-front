import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.tokens';
import { AllPost } from '../types/all-posts';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página actual (0-index)
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface DashboardOverview {
  totalPosts: number;
  averageDepressionScore: number;
  mostDepressedSubreddit: string;
  totalSubredditsActive: number;
  lastAnalysisDate: string;
}

export interface TrendPoint {
  date: string;
  avgScore: number;
}

export interface DistributionBucket {
  range: string;
  count: number;
}

export interface CriticalPost {
  postId: number;
  subreddit: string;
  depressionScore: number;
  label: string;
  date: string;
  excerpt: string;
  author?: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/dashboard`;
  }

  // Formatea 'YYYY-MM-DD' a 'YYYY-MM-DDTHH:mm:ss'. Si ya viene con 'T', no lo modifica.
  private formatDateTime(dateStr: string, endOfDay = false): string {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr;
    const time = endOfDay ? '23:59:59' : '00:00:00';
    return `${dateStr}T${time}`;
  }

  getOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.apiUrl}/overview`);
  }

  getTrend(subreddit: string, start: string, end: string): Observable<TrendPoint[]> {
    const params = new URLSearchParams();
    if (subreddit) params.append('subreddit', subreddit);
    if (start) params.append('start', this.formatDateTime(start, false));
    if (end) params.append('end', this.formatDateTime(end, true));
    return this.http.get<TrendPoint[]>(`${this.apiUrl}/trend?${params.toString()}`);
  }

  getDistribution(subreddit: string): Observable<DistributionBucket[]> {
    const params = new URLSearchParams();
    if (subreddit) params.append('subreddit', subreddit);
    return this.http.get<DistributionBucket[]>(`${this.apiUrl}/distribution?${params.toString()}`);
  }

  getCriticalPosts(threshold: number, limit: number): Observable<CriticalPost[]> {
    const params = new URLSearchParams();
    params.append('threshold', String(threshold));
    params.append('limit', String(limit));
    return this.http.get<CriticalPost[]>(`${this.apiUrl}/posts/critical?${params.toString()}`);
  }

  // Posts analizados, paginados
  getAllAnalyzedPosts(page: number, size: number): Observable<PageResponse<AllPost>> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    return this.http.get<PageResponse<AllPost>>(`${this.apiUrl}/posts/all?${params.toString()}`);
  }
}