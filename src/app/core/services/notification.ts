import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
AppNotification,
NotificationsResponse,
UnreadCountResponse
} from '../models/notification';

@Injectable({
providedIn: 'root'
})
export class NotificationService {
private readonly http = inject(HttpClient);
private readonly apiUrl = `${environment.apiUrl}/notifications`;
getMyNotifications(): Observable<NotificationsResponse> {
return this.http.get<NotificationsResponse>(this.apiUrl);
}

getUnreadCount(): Observable<UnreadCountResponse> {
return this.http.get<UnreadCountResponse>(
`${this.apiUrl}/unread-count`
);
}

markAsRead(id: number): Observable<unknown> {
return this.http.put(`${this.apiUrl}/${id}/read`, {});
}

markAllAsRead(): Observable<unknown> {
return this.http.put(`${this.apiUrl}/read-all`, {});
}
}
