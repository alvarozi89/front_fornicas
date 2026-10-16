import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../../core/services/forum';
import { ForumTopic } from '../../../../core/models/forum';
import { City } from '../../../../core/models/city';
import { LocationService } from '../../../../core/services/location';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forum-list.html',
  styleUrls: ['./forum-list.css']
})
export class ForumListComponent implements OnInit {
  private readonly forumService = inject(ForumService);
  private readonly locationService = inject(LocationService);
  private readonly cdr = inject(ChangeDetectorRef);

  topics: ForumTopic[] = [];
  cities: City[] = [];
  selectedCityId: number | null = null;
  citySearchText = '';
  modalCitySearchText = '';
  totalTopics = 0;
  currentPage = 1;
  limit = 5;
  totalPages = 1;
  isLoading = false;

  showCreateModal = false;
  isSubmitting = false;

  newTopic: ForumTopic = {
    title: '',
    nickname: '',
    content: '',
    city_id: 0
  };

  ngOnInit(): void {
    this.loadCities();
    this.loadTopics(1);
  }

  // 🏙️ Lógica de ciudades
  get filteredCities(): City[] {
    const search = this.citySearchText.trim().toLowerCase();
      this.cdr.detectChanges();
    if (!search) {
      return this.cities;

    }
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(search)

    );

  }

 // 🏙️ Filtrar y seleccionar ciudad desde el input superior
  filterCities(): void {
    const search = this.citySearchText.trim().toLowerCase();

    if (!search) {
      this.selectedCityId = null;
      this.applyFilters();
      return;
    }

    // Buscamos si el texto escrito coincide exactamente con alguna ciudad
    const city = this.cities.find(
      c => c.name.toLowerCase() === search

    );

    if (city) {
      this.selectedCityId = city.id;
      this.applyFilters();
            this.cdr.detectChanges();
    } else {
      // Si el usuario está escribiendo pero aún no completa una ciudad válida,
      // podemos limpiar el filtro temporalmente o dejar que siga escribiendo
      this.selectedCityId = null;
            this.cdr.detectChanges();
    }
  }

  // Método específico al seleccionar una opción de la lista desplegable del datalist
  onCitySelected(cityName: string): void {
    this.citySearchText = cityName;
    const city = this.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());

    if (city) {
      this.selectedCityId = city.id;
      this.applyFilters();
    }
  }

  clearCityFilter(): void {
    this.citySearchText = '';
    this.selectedCityId = null;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  private loadCities(): void {
    this.locationService.getCities().subscribe({
      next: (cities: any) => {
        // Soporta por si viene envuelto en un objeto .data o como arreglo directo
        this.cities = cities.data || cities;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar ciudades:', error);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadTopics(1);
  }

  // 💬 Lógica de Temas del Foro
  loadTopics(page: number = 1): void {
    if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
      return;
    }

    this.isLoading = true;
    this.currentPage = page;

    this.forumService.getTopics(this.currentPage, this.limit, this.selectedCityId).subscribe({
      next: (response: any) => {
        const root = response.data || response;

        this.topics = root.topics || root.data || (Array.isArray(root) ? root : []);
        this.totalTopics = root.total || root.count || this.topics.length || 0;
        this.totalPages = root.totalPages || Math.ceil(this.totalTopics / this.limit) || 1;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar temas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal(): void {
    this.showCreateModal = true;
    this.cdr.detectChanges();
  }

// Actualiza tu método closeModal para resetear también este texto:
closeModal(): void {
  this.showCreateModal = false;
  this.modalCitySearchText = '';
  this.newTopic = { title: '', nickname: '', content: '', city_id: 0 };
  this.cdr.detectChanges();
}

  onCreateTopic(): void {
    if (!this.newTopic.title.trim() || !this.newTopic.nickname.trim() || !this.newTopic.content.trim() || !this.newTopic.city_id) {
      alert('Por favor completa todos los campos obligatorios, incluyendo la ciudad.');
      return;

    }

    this.isSubmitting = true;
    this.forumService.createTopic(this.newTopic).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.loadTopics(1);
         this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al crear tema:', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadTopics(page);
      this.cdr.detectChanges();
    }
  }
  // Y añade este método para manejar la selección del modal:
selectModalCity(cityName: string): void {
  const city = this.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  if (city) {
    this.newTopic.city_id = city.id;
     this.cdr.detectChanges();
  } else {
    this.newTopic.city_id = 0;
     this.cdr.detectChanges();
  }
}


}
