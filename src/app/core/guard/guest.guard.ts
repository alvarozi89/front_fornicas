import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { TokenStorageService } from '../services/token-storage';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const token = tokenStorage.getToken();



  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
