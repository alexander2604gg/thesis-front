import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.toLowerCase();
  const isLogin = url.includes('/api/authentication/login');

  if (isLogin) {
    // No adjuntar Authorization en la autenticación
    return next(req);
  }

  const token = localStorage.getItem('jwt');
  const hasAuthHeader = req.headers.has('Authorization');
  if (token && !hasAuthHeader) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};