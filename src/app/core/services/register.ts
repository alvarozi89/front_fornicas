
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birth_date: string;
  city_id: number;
  nickname?: string;
  title?: string;
  description?: string;
  whatsapp?: string;
  telegram?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      role: string;
    };
    profile: {
      id: number;
      name: string;
      city_id: number;
      title?: string;
    };
    subscription: {
      id: number;
      type: string;
      status: string;
      start_date: string;
      end_date: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  register(data: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }
}

