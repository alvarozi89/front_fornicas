
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  RegisterService,
  RegisterData
} from '../../../../core/services/register';

import { LocationService } from '../../../../core/services/location';

import { City } from '../../../../core/models/city';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly registerService = inject(RegisterService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  cities: City[] = [];
  citySearch = '';
  filteredCities: City[] = [];
  showCitySuggestions = false;

  isLoadingCities = false;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';

  form: RegisterData = {
    email: '',
    password: '',
    name: '',
    birth_date: '',
    city_id: 0,
    nickname: '',
    title: '',
    description: '',
    whatsapp: '',
    telegram: ''
  };

  constructor() {
    this.loadCities();
  }

  filterCities(): void {
  const search = this.citySearch.trim().toLowerCase();

    this.form.city_id = 0;

    this.filteredCities = search
      ? this.cities
          .filter(city => city.name.toLowerCase().includes(search))
          .slice(0, 10)
      : [];

    this.showCitySuggestions = true;
  }

  selectCity(city: City): void {
    this.form.city_id = city.id;
    this.citySearch = city.name;
    this.showCitySuggestions = false;
  }

  onCitySearchFocus(): void {
    this.filterCities();
  }

  loadCities(): void {
    this.isLoadingCities = true;

    this.locationService.getCities().subscribe({
      next: (response: any) => {
        this.cities = response.data ?? response;
        this.isLoadingCities = false;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar las ciudades.';
        this.isLoadingCities = false;
      }
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.form.email.trim() ||
      !this.form.password ||
      !this.form.name.trim() ||
      !this.form.birth_date ||
      !this.form.city_id
    ) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      return;
    }

    if (this.form.password.length < 8) {
      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    const birthDate = new Date(`${this.form.birth_date}T00:00:00`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    if (Number.isNaN(birthDate.getTime()) || age < 18) {
      this.errorMessage =
        'Debes ser mayor de 18 años para registrarte.';
      return;
    }

    this.isSubmitting = true;

    this.registerService.register(this.form).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          this.successMessage =
            '¡Registro exitoso! Ya puedes iniciar sesión.';

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        this.errorMessage =
          error.error?.message ??
          'No fue posible completar el registro.';
      }
    });
  }
}

