import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthStateService } from '../../../core/services/auth-state.service';
import { NotificationService } from '../../../core/services/notification';
import { MyProfileService } from '../../../core/services/my-profile';
import { Profile } from '../../../core/models/profile';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly myProfileService = inject(MyProfileService);

  private authSubscription?: Subscription;

  // 🚀 Definimos el estado mediante Signals (cero necesidad de cdr)
  profile = signal<Profile | null>(null);
  profilePhotoUrl = signal<string | null>(null);
  unreadCount = signal<number>(0);

  ngOnInit(): void {
    this.authSubscription = this.authState.authenticated$.subscribe(
      (authenticated) => {
        if (authenticated && this.isWoman) {
          this.loadUnreadCount();
          this.loadProfilePhoto();
        } else {
          this.profile.set(null);
          this.profilePhotoUrl.set(null);
          this.unreadCount.set(0);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  get isAuthenticated(): boolean {
    return this.authState.isAuthenticated();
  }

  get email(): string {
    return this.authState.getCurrentUser()?.email ?? '';
  }

  get isWoman(): boolean {
    return this.authState.getRole() === 'WOMAN';
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        // Al actualizar el signal, Angular redibuja la vista automáticamente
        this.unreadCount.set(response.data.unread);
      },
      error: (error) => {
        console.error('Error al consultar notificaciones:', error);
      }
    });
  }

  loadProfilePhoto(): void {
    this.myProfileService.getMyProfile().subscribe({
      next: (response) => {
        const profileData = response.data;
        this.profile.set(profileData);

        const mainPhoto = profileData.photos?.find(photo => photo.is_main)
          ?? profileData.photos?.[0];

        if (mainPhoto && mainPhoto.url) {
          const baseUrl = environment.apiUrlPhoto.endsWith('/')
            ? environment.apiUrlPhoto.slice(0, -1)
            : environment.apiUrlPhoto;

          const photoPath = mainPhoto.url.startsWith('/')
            ? mainPhoto.url
            : `/${mainPhoto.url}`;

          this.profilePhotoUrl.set(`${baseUrl}${photoPath}`);
        } else {
          this.profilePhotoUrl.set(null);
        }
      },
      error: (error) => {
        console.error('Error al cargar la foto de perfil:', error);
        this.profilePhotoUrl.set(null);
      }
    });
  }

  logout(): void {
    this.authState.logout();
    this.profile.set(null);
    this.profilePhotoUrl.set(null);
    this.unreadCount.set(0);
    this.router.navigate(['/auth/login']);
  }
}
