import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { TokenStorageService } from '../../../../core/services/token-storage';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { LoginRequest } from '../../../../core/models/auth/login-request';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      const user = this.tokenStorage.getUser();
      if (user?.role === 'WOMAN') {
        this.router.navigate(['/panel']);
      }
    }
  }

  login(): void {
    this.errorMessage = '';

    if (!this.credentials.email.trim() || !this.credentials.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.tokenStorage.saveToken(response.data.token);
        this.tokenStorage.saveUser(response.data.user);

        // 🚀 Notificamos al sistema global que la sesión está activa (Actualiza el Navbar al instante)
        this.authState.setAuthenticated();

        this.loading = false;

        if (response.data.user.role === 'WOMAN') {
          this.router.navigate(['/panel']);
        } else {
          this.errorMessage = 'El panel de administración estará disponible más adelante.';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'No fue posible iniciar sesión.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
