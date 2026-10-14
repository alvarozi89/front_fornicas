import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenStorageService } from './token-storage';
import { AuthUser } from '../models/auth/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly authenticatedSubject = new BehaviorSubject<boolean>(
    !!this.tokenStorage.getToken()
  );

  readonly authenticated$ = this.authenticatedSubject.asObservable();

  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getCurrentUser(): AuthUser | null {
    return this.tokenStorage.getUser();
  }

  getRole(): AuthUser['role'] | null {
    return this.getCurrentUser()?.role ?? null;
  }

  refreshState(): void {
    this.authenticatedSubject.next(!!this.tokenStorage.getToken());
  }

  setAuthenticated(): void {
    this.refreshState();
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.authenticatedSubject.next(false);
  }
}
