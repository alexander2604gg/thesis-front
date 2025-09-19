import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConfiguracionData {
  subreddit: string;
  startDate: string;
  endDate: string;
  interval: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private readonly apiUrl = 'http://localhost:8080/api/forum-config';

  constructor(private http: HttpClient) {}

  guardarConfiguracion(config: ConfiguracionData): Observable<string> {
    const payload = {
      ...config,
      startDate: config.startDate + 'T00:00:00',
      endDate: config.endDate + 'T00:00:00'
    };

    return this.http.post(this.apiUrl, payload, { responseType: 'text' });
  }
}