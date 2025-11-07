import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/config/api.tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl: string) {
    const hasToken = !!localStorage.getItem('jwt');
    this.isAuthenticatedSubject.next(hasToken);
  }

  login(email: string, password: string) {
    const url = `${this.baseUrl}/api/authentication/login`;
    return this.http.post<{ email: string; jwt: string }>(url, { email, password }).pipe(
      map((resp) => {
        if (resp?.jwt) {
          localStorage.setItem('jwt', resp.jwt);
          localStorage.setItem('userEmail', resp.email ?? email);
          localStorage.setItem('isLoggedIn', 'true');
          this.isAuthenticatedSubject.next(true);
          return true;
        }
        return false;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  // Registro de usuario
  register(payload: {
    email: string;
    password: string;
    personRegisterDto: {
      firstName: string;
      secondName?: string;
      country?: string;
      phoneNumber?: string;
    };
  }) {
    const url = `${this.baseUrl}/api/user`; // Ajustar si tu backend usa otra ruta
    return this.http.post(url, payload).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwt');
    localStorage.removeItem('userEmail');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}