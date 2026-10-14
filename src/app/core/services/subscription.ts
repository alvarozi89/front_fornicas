import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveSubscriptionResponse } from '../models/subscription';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/subscriptions`;

  getActiveSubscription(): Observable<ActiveSubscriptionResponse> {
    return this.http.get<ActiveSubscriptionResponse>(
      `${this.apiUrl}/me/active`
    );
  }
}
