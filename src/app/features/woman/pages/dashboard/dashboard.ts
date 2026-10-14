
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { MyProfileService } from '../../../../core/services/my-profile';
import { Profile } from '../../../../core/models/profile';
import {
  ChangeDetectorRef,
  } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly profileService = inject(MyProfileService);
  private readonly cdr = inject(ChangeDetectorRef);

  profile: Profile | null = null;
  isLoadingProfile = true;

  get email(): string {
    return this.authState.getCurrentUser()?.email ?? '';
  }

  ngOnInit(): void {

    this.profileService.getMyProfile().subscribe({

      next: response => {
        this.profile = response.data;
        this.isLoadingProfile = false;
         this.cdr.detectChanges();

      },
      error: error => {
        console.error('Error al cargar el perfil:', error);
        this.profile = null;
        this.isLoadingProfile = false;
         this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authState.logout();
    this.router.navigate(['/auth/login']);
     this.cdr.detectChanges();
  }
}
