
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';
import { environment } from '../../../environments/environment';

export interface MyProfileResponse {
  success: boolean;
  data: Profile;
}

export interface UpdateMyProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}
// 🚀 Interfaz para la respuesta del cambio de contraseña
export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class MyProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profiles`;

  getMyProfile(): Observable<MyProfileResponse> {
    return this.http.get<MyProfileResponse>(`${this.apiUrl}/me`);
  }

  updateMyProfile(
    data: Partial<Profile>
  ): Observable<UpdateMyProfileResponse> {
    return this.http.put<UpdateMyProfileResponse>(
      `${this.apiUrl}/me`,
      data
    );
  }

  updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<UpdatePasswordResponse> {
    return this.http.put<UpdatePasswordResponse>(
      `${this.apiUrl}/update-password`,
      data
    );
  }
}

