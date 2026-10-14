
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private readonly storageKey = 'fornicas_visitor_token';

  getVisitorToken(): string {
    let token = localStorage.getItem(this.storageKey);

    if (!token) {
      token = this.generateToken();
      localStorage.setItem(this.storageKey, token);
    }

    return token;
  }

  private generateToken(): string {
    return crypto.randomUUID();
  }
}
