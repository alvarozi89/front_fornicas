
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilesResponse } from '../models/profile';
import { ProfileDetailResponse,  } from '../models/profile';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profiles`;

  getProfiles(
    page = 1,
    limit = 8,
    search = '',
    cityId: number | null = null
  ): Observable<ProfilesResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

   if (search.trim()) params = params.set('name', search.trim());
    if (cityId !== null) params = params.set('cityId', cityId);

    return this.http.get<ProfilesResponse>(this.apiUrl, { params });
  }
  getProfileById(id: number): Observable<ProfileDetailResponse> {
  return this.http.get<ProfileDetailResponse>(`${this.apiUrl}/${id}`);
}
}
