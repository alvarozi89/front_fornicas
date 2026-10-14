
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/ratings`;

  createRating(
    profileId: number,
    rating: number,
    visitorToken: string
  ): Observable<unknown> {
    const headers = new HttpHeaders({
      'x-visitor-token': visitorToken
    });

    return this.http.post(
      `${this.apiUrl}/${profileId}`,
      { rating },
      { headers }
    );
  }
}
