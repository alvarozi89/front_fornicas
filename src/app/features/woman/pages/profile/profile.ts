
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MyProfileService } from '../../../../core/services/my-profile';
import { Profile } from '../../../../core/models/profile';
import { LocationService } from '../../../../core/services/location';
import { City } from '../../../../core/models/city';
import { Photo } from '../../../../core/models/photo';
import { PhotoService } from '../../../../core/services/photo';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfilePage implements OnInit {
  private readonly profileService = inject(MyProfileService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly locationService = inject(LocationService);
  private readonly photoService = inject(PhotoService);

  cities: City[] = [];
  isLoadingCities = false;
  cityError = '';

  profile: Profile | null = null;
  isLoading = true;
  isEditing = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  citySearch = '';
  filteredCities: City[] = [];
  showCitySuggestions = false;

  // Fotografías
  photos: Photo[] = [];
  isLoadingPhotos = false;
  isUploadingPhoto = false;
  photoError = '';
  photoMessage = '';
  selectedPhotoFile: File | null = null;

  showPhotoModal = false;
  photoModalAction: 'delete' | 'main' | null = null;
  selectedPhotoForModal: Photo | null = null;
  total_views?: number;
  rating?: {
    average: number;
    total: number;
  };

  formData = {
    name: '',
    title: '',
    nickname: '',
    birth_date: '',
    description: '',
    city_id: null as number | null,
    whatsapp: '',
    telegram: ''
  };

  ngOnInit(): void {
    this.loadProfile();
    this.loadCities();
  }

  openPhotoModal(photo: Photo, action: 'delete' | 'main'): void {
  this.selectedPhotoForModal = photo;
  this.photoModalAction = action;
    this.showPhotoModal = true;
  }

  closePhotoModal(): void {
    this.showPhotoModal = false;
    this.photoModalAction = null;
    this.selectedPhotoForModal = null;
  }

  confirmPhotoAction(): void {
  const photo = this.selectedPhotoForModal;
  const action = this.photoModalAction;

  if (!photo || !action) {
    this.closePhotoModal();
    return;
  }

  this.closePhotoModal();

  if (action === 'delete') {
    this.deletePhoto(photo);
  } else if (action === 'main') {
    this.setMainPhoto(photo);
  }
}

  filterCities(): void {
    const search = this.citySearch.trim().toLowerCase();

    this.formData.city_id = null;
    this.cityError = '';

    this.filteredCities = search
      ? this.cities
          .filter(city => city.name.toLowerCase().includes(search))
          .slice(0, 10)
      : [];

    this.showCitySuggestions = true;
  }

  selectCity(city: City): void {
    this.formData.city_id = city.id;
    this.citySearch = city.name;
    this.cityError = '';
    this.showCitySuggestions = false;
  }

  onCitySearchFocus(): void {
    this.filterCities();
  }

  getSelectedCityName(): string {
    return this.cities.find(
      city => city.id === this.formData.city_id
    )?.name ?? '';
  }

  getCityName(cityId: number | null): string {
    if (cityId === null) return '';

    return this.cities.find(city => city.id === cityId)?.name ?? '';
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getMyProfile().subscribe({
      next: response => {
        this.profile = response.data;
        this.copyProfileToForm();
        this.isLoading = false;

        this.loadPhotos();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al cargar mi perfil:', error);
        this.errorMessage =
          error.error?.message ?? 'No fue posible cargar tu perfil.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCities(): void {
    this.isLoadingCities = true;

    this.locationService.getCities().subscribe({
      next: cities => {
        this.cities = cities;
        this.isLoadingCities = false;

        // Actualizar el nombre si el perfil llegó antes que las ciudades.
        if (this.profile && !this.isEditing) {
          this.citySearch = this.getCityName(this.profile.city_id);
        }

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al cargar ciudades:', error);
        this.isLoadingCities = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEditing(): void {
    if (!this.profile) return;

    this.copyProfileToForm();
    this.errorMessage = '';
    this.successMessage = '';
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.copyProfileToForm();
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveProfile(): void {
    if (!this.profile || this.isSaving) return;

    if (!this.formData.city_id) {
      this.cityError = 'Selecciona una ciudad de las sugerencias.';
      this.showCitySuggestions = true;
      this.filterCities();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService.updateMyProfile({
      ...this.formData
    }).subscribe({
      next: response => {
        this.profile = response.data;
        this.copyProfileToForm();
        this.isEditing = false;
        this.isSaving = false;
        this.successMessage =
          response.message || 'Perfil actualizado correctamente.';
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al actualizar el perfil:', error);
        this.errorMessage =
          error.error?.message ?? 'No fue posible guardar los cambios.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ---------- Gestión de fotografías ----------

  loadPhotos(): void {
    if (!this.profile) return;

    this.isLoadingPhotos = true;
    this.photoError = '';

    this.photoService.getPhotosByProfile(this.profile.id).subscribe({
      next: response => {
        this.photos = [...response.data].sort(
          (a, b) => a.sort_order - b.sort_order
        );
        this.isLoadingPhotos = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al cargar fotografías:', error);
        this.photoError =
          error.error?.message ?? 'No fue posible cargar las fotografías.';
        this.isLoadingPhotos = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedPhotoFile = null;
    this.photoError = '';
    this.photoMessage = '';

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.photoError = 'Selecciona una imagen JPG, PNG o WEBP.';
      input.value = '';
      this.cdr.detectChanges();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.photoError = 'La imagen no puede superar los 5 MB.';
      input.value = '';
      this.cdr.detectChanges();
      return;
    }

    if (this.photos.length >= 10) {
      this.photoError = 'Has alcanzado el límite máximo de 10 fotos.';
      input.value = '';
      this.cdr.detectChanges();
      return;
    }

    this.selectedPhotoFile = file;
    this.cdr.detectChanges();
  }

  uploadPhoto(): void {
    if (!this.selectedPhotoFile || this.isUploadingPhoto) return;

    this.isUploadingPhoto = true;
    this.photoError = '';
    this.photoMessage = '';

    this.photoService.uploadPhoto(this.selectedPhotoFile).subscribe({
      next: response => {
        this.photoMessage =
          response.message || 'Fotografía subida correctamente.';
        this.selectedPhotoFile = null;
        this.isUploadingPhoto = false;

        this.loadPhotos();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al subir fotografía:', error);
        this.photoError =
          error.error?.message ?? 'No fue posible subir la fotografía.';
        this.isUploadingPhoto = false;
        this.cdr.detectChanges();
      }
    });
  }

  setMainPhoto(photo: Photo): void {
    if (photo.is_main) return;

    this.photoError = '';
    this.photoMessage = '';

    this.photoService.setMainPhoto(photo.id).subscribe({
      next: response => {
        this.photoMessage =
          response.message || 'Foto principal actualizada correctamente.';
        this.loadPhotos();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al cambiar foto principal:', error);
        this.photoError =
          error.error?.message ?? 'No fue posible cambiar la foto principal.';
        this.cdr.detectChanges();
      }
    });
  }

  deletePhoto(photo: Photo): void {


    this.photoError = '';
    this.photoMessage = '';

    this.photoService.deletePhoto(photo.id).subscribe({
      next: response => {
        this.photoMessage =
          response.message || 'Fotografía eliminada correctamente.';
        this.loadPhotos();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al eliminar fotografía:', error);
        this.photoError =
          error.error?.message ?? 'No fue posible eliminar la fotografía.';
        this.cdr.detectChanges();
      }
    });
  }

  getPhotoUrl(url: string): string {
    return this.photoService.getPhotoUrl(url);
  }

  private copyProfileToForm(): void {
    if (!this.profile) return;

    this.formData = {
      name: this.profile.name ?? '',
      title: this.profile.title ?? '',
      nickname: this.profile.nickname ?? '',
      birth_date: this.profile.birth_date?.substring(0, 10) ?? '',
      description: this.profile.description ?? '',
      city_id: this.profile.city_id,
      whatsapp: this.profile.whatsapp ?? '',
      telegram: this.profile.telegram ?? ''
    };

    this.citySearch = this.getSelectedCityName();
  }
}
