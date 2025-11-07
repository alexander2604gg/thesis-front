import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./features/configuracion/configuracion').then(m => m.Configuracion),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuraciones-registradas',
    loadComponent: () => import('./features/configuraciones-registradas/configuraciones-registradas').then(m => m.ConfiguracionesRegistradas),
    canActivate: [AuthGuard]
  },
  {
    path: 'lotes/:id',
    loadComponent: () => import('./features/lotes/lotes').then(m => m.Lotes),
    canActivate: [AuthGuard]
  },
  {
    path: 'posts-analizados/:idLot',
    loadComponent: () => import('./features/posts/posts-analizados.component').then(m => m.PostsAnalizadosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reporte-general/:id',
    loadComponent: () => import('./features/stats/reporte-general.component').then(m => m.ReporteGeneralComponent),
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard-page.component').then(m => m.DashboardPageComponent),
    canActivate: [AuthGuard]
  }
];
