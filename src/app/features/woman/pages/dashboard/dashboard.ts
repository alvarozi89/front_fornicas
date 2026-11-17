import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { MyProfileService } from '../../../../core/services/my-profile';
import { ProfileService } from '../../../../core/services/profile';
import { Profile } from '../../../../core/models/profile';
import { ChangeDetectorRef } from '@angular/core';
import { SubscriptionService } from '../../../../core/services/subscription';
import { Subscription as UserSubscription } from '../../../../core/models/subscription';
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
  private readonly profileServ = inject(ProfileService);
   private readonly subscriptionService = inject(SubscriptionService);
  private readonly cdr = inject(ChangeDetectorRef);


  profile: Profile | null = null;
  isLoadingProfile = true;
  subscription: UserSubscription | null = null;
  isLoading = true;
  errorMessage = '';

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
     this.loadSubscription();
  }

  logout(): void {
    this.authState.logout();
    this.router.navigate(['/auth/login']);
    this.cdr.detectChanges();
  }

  confirmDeactivation(): void {
    this.profileServ.deactivateAccount().subscribe({
      next: (res: any) => {
        alert(res.message || 'Tu perfil ha sido dado de baja de forma exitosa.');
        this.authState.logout();
        this.router.navigate(['/auth/login']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al dar de baja el perfil:', err);
        alert(err.error?.message || 'Ocurrió un error al intentar dar de baja la cuenta.');
      }
    });
  }

    loadSubscription(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptionService.getActiveSubscription().subscribe({
      next: (response) => {
        this.subscription = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Subscription loaded:', this.subscription);
      },
      error: (error) => {
        console.error('Error al cargar la suscripción:', error);
        this.errorMessage = 'No fue posible consultar tu suscripción.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
