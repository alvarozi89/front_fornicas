import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ForumTopic,
  ForumComment,
  ForumTopicsResponse,
  ForumDetailResponse
} from '../models/forum';

export interface ForumApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/forum`;

  // Actualizado para aceptar cityId opcional
  getTopics(page: number = 1, limit: number = 10, cityId?: number | null): Observable<ForumTopicsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (cityId) {
      params = params.set('city_id', cityId.toString());
    }

    return this.http.get<ForumTopicsResponse>(`${this.apiUrl}/topics`, { params });
  }

  getTopicById(id: number): Observable<ForumDetailResponse> {
    return this.http.get<ForumDetailResponse>(`${this.apiUrl}/topics/${id}`);
  }

  createTopic(data: ForumTopic): Observable<ForumApiResponse<ForumTopic>> {
    return this.http.post<ForumApiResponse<ForumTopic>>(`${this.apiUrl}/topics`, data);
  }

  createComment(topicId: number, data: ForumComment): Observable<ForumApiResponse<ForumComment>> {
    return this.http.post<ForumApiResponse<ForumComment>>(`${this.apiUrl}/topics/${topicId}/comments`, data);
  }

  reportTopic(topicId: number, reason: string): Observable<ForumApiResponse<any>> {
    return this.http.post<ForumApiResponse<any>>(`${this.apiUrl}/topics/${topicId}/report`, { reason });
  }

  reportComment(commentId: number, reason: string): Observable<ForumApiResponse<any>> {
    return this.http.post<ForumApiResponse<any>>(`${this.apiUrl}/comments/${commentId}/report`, { reason });
  }
}
