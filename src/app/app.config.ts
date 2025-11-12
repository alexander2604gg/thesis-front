import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from './core/config/api.tokens';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';
import { authInterceptor } from './features/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    //{ provide: API_BASE_URL, useValue: 'http://tesis-backend-env.eba-hps3gvue.us-east-2.elasticbeanstalk.com' },
    { provide: API_BASE_URL, useValue: 'http://10.0.2.119:8080' },
  ]
};
