import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { TokenStorageService } from '../../../../core/services/token-storage';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { LoginRequest } from '../../../../core/models/auth/login-request';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  // 🚀 Signals para el formulario de Login principal
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // 🚀 Signals para el Modal de Recuperación de Contraseña
  recoveryEmail = '';
  forgotLoading = signal<boolean>(false);
  forgotErrorMessage = signal<string>('');
  forgotSuccessMessage = signal<string>('');

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      const user = this.tokenStorage.getUser();
      if (user?.role === 'WOMAN') {
        this.router.navigate(['/panel']);
      }
    }
  }

  login(): void {
    this.errorMessage.set('');

    if (!this.credentials.email.trim() || !this.credentials.password) {
      this.errorMessage.set('Ingresa tu correo y contraseña.');
      return;
    }

    this.loading.set(true);

    this.authService.login(this.credentials)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.tokenStorage.saveToken(response.data.token);
          this.tokenStorage.saveUser(response.data.user);

          // Notificamos al sistema global que la sesión está activa (Actualiza el Navbar al instante)
          this.authState.setAuthenticated();

          if (response.data.user.role === 'WOMAN') {
            this.router.navigate(['/panel']);
          } else {
            this.errorMessage.set('El panel de administración estará disponible más adelante.');
          }
        },
        error: (error) => {
          const msg = error.error?.message || 'No fue posible iniciar sesión.';
          this.errorMessage.set(msg);
        }
      });
  }

  // 🚀 Método de recuperación reactivo con Signals (sin cdr)
  sendRecoveryEmail(): void {
    this.forgotErrorMessage.set('');
    this.forgotSuccessMessage.set('');

    if (!this.recoveryEmail.trim()) {
      this.forgotErrorMessage.set('Por favor ingresa tu correo electrónico.');
      return;
    }

    this.forgotLoading.set(true);

    this.authService.forgotPassword(this.recoveryEmail)
      .pipe(
        finalize(() => this.forgotLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          const msg = response.message || 'Se ha enviado un enlace de recuperación a tu correo.';
          this.forgotSuccessMessage.set(msg);
          this.recoveryEmail = ''; // Limpiamos el input
        },
        error: (error) => {
          const errText = error.error?.message || 'No se pudo procesar la solicitud. Verifica el correo.';
          this.forgotErrorMessage.set(errText);
        }
      });
  }
}
