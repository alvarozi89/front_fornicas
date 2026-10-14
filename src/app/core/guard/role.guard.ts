
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const roleGuard: CanActivateFn = (route) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;
  const currentRole = authState.getRole();
  console.log('Ruta al recargar:', router.url);
console.log('Autenticado:', authState.isAuthenticated());
console.log('Rol detectado:', currentRole);
console.log('Roles permitidos:', route.data['roles']);

  if (allowedRoles?.includes(currentRole ?? '')) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
