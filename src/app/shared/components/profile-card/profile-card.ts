import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
selector: 'app-profile-card',
standalone: true,
imports: [RouterLink],
templateUrl: './profile-card.html',
styleUrl: './profile-card.css'
})
export class ProfileCard {
  @Input() name = 'Perfil';
  @Input() age: number | null = null;
  @Input() photoUrl = '/images/profile-placeholder.jpg';
  @Input() description = 'Conoce más sobre este perfil.';
  @Input() city = '';

  @Input() profileId!: number;
  @Input() totalViews = 0;
@Input() rating: number | null = null;
get formattedRating(): string {
  return this.rating === null ? 'Sin calificar' : this.rating.toFixed(1);
}
}
