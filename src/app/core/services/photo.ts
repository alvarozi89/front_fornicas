
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Photo,
  PhotosResponse,
  PhotoResponse,
  PhotoActionResponse
} from '../models/photo';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/photos`;
  private readonly uploadsUrl = `${environment.apiUrlPhoto}`;

  getPhotosByProfile(profileId: number): Observable<PhotosResponse> {
    return this.http.get<PhotosResponse>(
      `${this.apiUrl}/profile/${profileId}`
    );
  }

  uploadPhoto(file: File): Observable<PhotoResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<PhotoResponse>(
      this.apiUrl,
      formData
    );
  }

  deletePhoto(photoId: number): Observable<PhotoActionResponse> {
    return this.http.delete<PhotoActionResponse>(
      `${this.apiUrl}/${photoId}`
    );
  }

  setMainPhoto(photoId: number): Observable<PhotoResponse> {
    return this.http.put<PhotoResponse>(
      `${this.apiUrl}/${photoId}/main`,
      {}
    );
  }

  getPhotoUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${this.uploadsUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}
