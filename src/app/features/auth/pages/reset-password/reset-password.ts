import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  token = '';
  newPassword = '';
  confirmPassword = '';

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.errorMessage.set('El enlace de recuperación no es válido.');
    }
  }

  submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.token) {
      this.errorMessage.set('El enlace de recuperación no es válido.');
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage.set(
        'La contraseña debe tener al menos 8 caracteres.'
      );
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.authService.resetPassword(this.token, this.newPassword)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            response.message ||
            'Tu contraseña se actualizó correctamente.'
          );

          this.token = '';
          this.newPassword = '';
          this.confirmPassword = '';

          // Permite leer el mensaje antes de regresar al login.
          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              replaceUrl: true
            });
          }, 2000);
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message ||
            'No fue posible restablecer la contraseña. Solicita un nuevo enlace.'
          );
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
