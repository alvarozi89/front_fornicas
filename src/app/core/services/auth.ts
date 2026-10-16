
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/auth/login-request';
import { AuthResponse } from '../models/auth/auth-response';
import { TokenStorageService } from './token-storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

isLoggedIn(): boolean {
  return !!this.tokenStorage.getToken();
}

  // Temporalmente usamos la URL local del backend.
 private readonly apiUrl = `${environment.apiUrl}/auth`;
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{
  success: boolean;
  message: string;
}> {
  return this.http.post<{
    success: boolean;
    message: string;
  }>(`${this.apiUrl}/reset-password`, {
    token,
    newPassword
  });
}

getCurrentUser(): Observable<{ success: boolean; data: any }> {
  return this.http.get<{ success: boolean; data: any }>(
    `${this.apiUrl}/me`
  );
}
// 🚀 Nuevo método para solicitar el restablecimiento de contraseña
  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }
}
