import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthStateService } from '../../../core/services/auth-state.service';
import { NotificationService } from '../../../core/services/notification';

import { MyProfileService } from '../../../core/services/my-profile';
import { Profile } from '../../../core/models/profile';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
selector: 'app-navbar',
standalone: true,
imports: [RouterLink],
templateUrl: './navbar.html',
styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
private readonly authState = inject(AuthStateService);
private readonly router = inject(Router);
private readonly notificationService = inject(NotificationService);
private readonly myProfileService = inject(MyProfileService);
private readonly cdr = inject(ChangeDetectorRef);
private authSubscription?: Subscription;
profile: Profile | null = null;

profilePhotoUrl: string | null = null;

unreadCount = 0;
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

ngOnInit(): void {
  this.authSubscription = this.authState.authenticated$.subscribe(
    (authenticated) => {

      if (authenticated && this.isWoman) {
        this.loadUnreadCount();
        this.loadProfilePhoto();
        this.cdr.detectChanges();
      } else {
        this.profile = null;
        this.profilePhotoUrl = null;
        this.unreadCount = 0;
        this.cdr.detectChanges()
      }
    }
  );
}

loadUnreadCount(): void {
this.notificationService.getUnreadCount().subscribe({
next: (response) => {
this.unreadCount = response.data.unread;
  this.cdr.detectChanges();
},
error: (error) => {
console.error('Error al consultar notificaciones:', error);
}
});
}
loadProfilePhoto(): void {

this.myProfileService.getMyProfile().subscribe({
next: (response) => {
this.profile = response.data;
console.log('Perfil recibido en la barra:', response.data);
console.log('Fotos del perfil:', response.data.photos);

  this.cdr.detectChanges();
  const mainPhoto = this.profile.photos?.find(photo => photo.is_main)
    ?? this.profile.photos?.[0];

  this.profilePhotoUrl = mainPhoto
  ? `${environment.apiUrlPhoto}${mainPhoto.url}`
  : null;

},
error: (error) => {
  console.error('Error al cargar la foto de perfil:', error);
  this.profilePhotoUrl = null;
}


});
}


logout(): void {
this.authState.logout();
this.router.navigate(['/auth/login']);

}
}
