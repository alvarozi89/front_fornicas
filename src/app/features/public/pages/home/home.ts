
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../../../shared/components/navbar/navbar';
import { ProfileCard } from '../../../../shared/components/profile-card/profile-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Footer } from '../../../../shared/components/footer/footer';

import { ProfileService } from '../../../../core/services/profile';
import { Profile as ApiProfile } from '../../../../core/models/profile';

import { FormsModule } from '@angular/forms';
import { City } from '../../../../core/models/city';
import { LocationService } from '../../../../core/services/location';
import {  ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';
import { environment } from '../../../../../environments/environment';

interface ProfileView {
    id: number;
  name: string;
  age: number | null;
  photoUrl: string;
  description: string;
  city: string;
  totalViews: number;
  rating: number | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
imports: [
  Navbar,
  ProfileCard,
  Pagination,
  Footer,
  RouterLink,
  FormsModule
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentPage = 1;
  readonly pageSize = 8;
  searchText = '';
  selectedCityId: number | null = null;

private readonly locationService = inject(LocationService);
private readonly authService = inject(AuthService);


get isLoggedIn(): boolean {
  return this.authService.isLoggedIn();
}

 cities: City[] = [];
  citySearchText = '';
  profiles: ProfileView[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {

  this.loadProfiles();
  this.loadCities();
this.cdr.detectChanges();

}

get filteredCities(): City[] {
  const search = this.citySearchText.trim().toLowerCase();

  if (!search) {
    return this.cities;
  }

  return this.cities.filter(city =>
    city.name.toLowerCase().includes(search)
  );
}

filterCities(): void {
  const search = this.citySearchText.trim().toLowerCase();

  if (!search) {
    this.selectedCityId = null;
    this.applyFilters();
    return;
  }

  const city = this.cities.find(
    city => city.name.toLowerCase() === search
  );

  if (city) {
    this.selectedCityId = city.id;
    this.applyFilters();
  }
}

clearCityFilter(): void {
  this.citySearchText = '';
  this.selectedCityId = null;
  this.applyFilters();
}

private loadCities(): void {
  this.locationService.getCities().subscribe({
    next: (cities) => {
      this.cities = cities;
    },
    error: (error) => {
      console.error('Error al cargar ciudades:', error);
    }
  });
}
applyFilters(): void {
  this.currentPage = 1;
  this.loadProfiles();
}
  loadProfiles(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getProfiles(
  this.currentPage,
  this.pageSize,
  this.searchText,
  this.selectedCityId
).subscribe({
      next: (response) => {
        console.log(
  'Antes de actualizar:',
  this.profiles.map(profile => profile.id),
  'Nuevos datos:',
  response.data.profiles.map(profile => profile.id)
);
        console.log('Página solicitada:', this.currentPage);
console.log('Perfiles recibidos:', response.data.profiles.length);
console.log('Total de perfiles:', response.data.pagination.total);
console.log('IDs recibidos:', response.data.profiles.map(profile => profile.id));

this.profiles = response.data.profiles.map(
  (profile: ApiProfile): ProfileView => ({
    id: profile.id,
    name: profile.name,
    age: this.calculateAge(null),
    photoUrl: this.getPhotoUrl(profile),
    description: profile.title || 'Conoce más sobre este perfil.',
    city: profile.cityData?.name || 'Ciudad no especificada',
    totalViews: Number(profile.total_views ?? 0),
rating: profile.rating?.average != null
  ? Number(profile.rating.average)
  : null
  })
);
        this.totalPages = response.data.pagination.totalPages;
        this.totalProfiles = response.data.pagination.total;
        console.log('¿Angular actualizó los perfiles?', this.profiles.length);
console.log('¿Detección de cambios ejecutada?');
this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar perfiles:', error);
        this.errorMessage = 'No fue posible cargar los perfiles. Inténtalo más tarde.';
        this.isLoading = false;
      }
    });
  }

  private getPhotoUrl(profile: ApiProfile): string {
    const mainPhoto = profile.photos.find(photo => photo.is_main);
    const photo = mainPhoto || profile.photos[0];

    if (!photo?.url) {
      return '/images/profile-placeholder.jpg';
    }

    if (photo.url.startsWith('http://') || photo.url.startsWith('https://')) {
      return photo.url;
    }

    return `${environment.apiUrlPhoto}${photo.url}`;
  }

  private calculateAge(birthDate: string | null): number | null {
    if (!birthDate) {
      return null;
    }

    const today = new Date();
    const birth = new Date(`${birthDate}T00:00:00`);
    let age = today.getFullYear() - birth.getFullYear();

    const monthDifference = today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

totalPages = 1;
totalProfiles = 0;

  get visibleProfiles(): ProfileView[] {
    return this.profiles;
  }

changePage(page: number): void {
  console.log('Página seleccionada:', page);

  if (page < 1 || page > this.totalPages || page === this.currentPage) {
    return;
  }

  this.currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.loadProfiles();
}
}
