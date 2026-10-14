
import { Injectable } from '@angular/core';
import { AuthUser } from '../models/auth/auth-response';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly tokenKey = 'fornicas_token';
  private readonly userKey = 'fornicas_user';

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }

  saveUser(user: AuthUser): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  clearToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }
}
