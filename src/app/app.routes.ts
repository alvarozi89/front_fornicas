import { Routes } from '@angular/router';

import { authGuard } from './core/guard/auth.guard';
import { roleGuard } from './core/guard/role.guard';

export const routes: Routes = [
{
path: '',
loadComponent: () =>
import('./features/public/pages/home/home')
.then(m => m.Home)
},
{
path: 'auth',
loadChildren: () =>
import('./features/auth/auth.routes')
.then(m => m.AUTH_ROUTES)
},
{
  path: 'panel/suscripcion',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['WOMAN'] },
  loadComponent: () =>
    import('./features/woman/pages/subscription/subscription')
      .then(m => m.Subscription)
},
{
path: 'panel/notificaciones',
canActivate: [authGuard, roleGuard],
data: { roles: ['WOMAN'] },
loadComponent: () =>
import('./features/woman/pages/notifications/notifications')
.then(m => m.Notifications)
},


{
  path: 'panel/perfil',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['WOMAN'] },
  loadComponent: () =>
    import('./features/woman/pages/profile/profile')
      .then(m => m.ProfilePage)
},



{
path: 'perfil/:id',
loadComponent: () =>
import('./pages/profile-detail/profile-detail')
.then(m => m.ProfileDetail)
},
{
  path: 'panel',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['WOMAN'] },
  loadComponent: () =>
    import('./features/woman/pages/dashboard/dashboard')
      .then(m => m.Dashboard)
},
{
path: '**',
redirectTo: ''
}
];
