import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RateLimit, CreateRateLimitRequest } from '../models/rate-limit.model';


@Injectable({
  providedIn: 'root'
})
export class RateLimitService {

  private apiUrl = `${environment.apiUrl}/rate-limits`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<RateLimit[]> {
    return this.http.get<RateLimit[]>(this.apiUrl);
  }

  createOrUpdate(data: CreateRateLimitRequest): Observable<RateLimit> {
    return this.http.post<RateLimit>(this.apiUrl, data);
  }

  toggleActive(id: number): Observable<RateLimit> {
    return this.http.patch<RateLimit>(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}