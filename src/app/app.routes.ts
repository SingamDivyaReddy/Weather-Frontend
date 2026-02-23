import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'weather',
    loadComponent: () =>
      import('./components/weather/weather').then(m => m.Weather),
    canActivate: [authGuard]
  },
  {
  path: 'google-success',
  loadComponent: () =>
    import('./components/google-success/google-success')
      .then(m => m.GoogleSuccess)
}
];