
import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { guestGuard } from '../../core/guard/guest.guard';
import { ResetPassword } from './pages/reset-password/reset-password';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard]
  },
  {
  path: 'reset-password',
  component: ResetPassword
}
];
