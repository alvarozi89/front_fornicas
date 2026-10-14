
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly http = inject(HttpClient);
 private readonly apiUrl = `${environment.apiUrl}/comments`;

  createComment(
    profileId: number,
    nickname: string,
    content: string,
    visitorToken: string
  ): Observable<unknown> {
    const headers = new HttpHeaders({
      'x-visitor-token': visitorToken
    });

    return this.http.post(
      `${this.apiUrl}/${profileId}`,
      { nickname, content },
      { headers }
    );
  }

  moderateReview(
    commentId: number,
    status: 'APPROVED' | 'REJECTED'
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${commentId}/moderation`,
      { status }
    );
  }

getPendingByProfile(profileId: number): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/${profileId}/pending`
  );
}
}
