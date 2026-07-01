import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService, CreateApiServiceRequest } from '../models/api-service.model';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiService[]> {
    return this.http.get<ApiService[]>(this.apiUrl);
  }

  create(data: CreateApiServiceRequest): Observable<ApiService> {
    return this.http.post<ApiService>(this.apiUrl, data);
  }

  update(id: number, data: CreateApiServiceRequest): Observable<ApiService> {
    return this.http.put<ApiService>(`${this.apiUrl}/${id}`, data);
  }

  toggleActive(id: number): Observable<ApiService> {
    return this.http.patch<ApiService>(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}