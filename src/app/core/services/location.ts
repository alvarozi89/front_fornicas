
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { City } from '../models/city';
import { environment } from '../../../environments/environment';

interface CitiesResponse {
  success: boolean;
  data: City[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/locations`;

  getCities(): Observable<City[]> {
    return this.http
      .get<CitiesResponse>(`${this.apiUrl}/cities`)
      .pipe(map(response => response.data));
  }
}
