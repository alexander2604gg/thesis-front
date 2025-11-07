import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.tokens';

export interface ConfiguracionData {
  subreddit: string;
  startDate: string;
  endDate: string;
  interval: number;
}

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {}

  private get apiUrl(): string {
    return `${this.baseUrl}/api/forum-config`;
  }

  guardarConfiguracion(config: ConfiguracionData): Observable<string> {
    const payload = {
      ...config,
      startDate: config.startDate + 'T00:00:00',
      endDate: config.endDate + 'T00:00:00'
    };

    return this.http.post(this.apiUrl, payload, { responseType: 'text' });
  }
}