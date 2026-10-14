
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyProfileService } from '../../../../core/services/my-profile';
import { Profile } from '../../../../core/models/profile';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly profileService = inject(MyProfileService);

  profile: Profile | null = null;
  isLoadingProfile = true;

  ngOnInit(): void {
    this.profileService.getMyProfile().subscribe({
      next: response => {
        this.profile = response.data;
        this.isLoadingProfile = false;
      },
      error: error => {
        console.error('Error al cargar el perfil:', error);
        this.profile = null;
        this.isLoadingProfile = false;
      }
    });
  }
}
