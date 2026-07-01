import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiKey, ApiKeyResponse, CreateApiKeyRequest } from '../models/api-key.model';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  private apiUrl = `${environment.apiUrl}/keys`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(this.apiUrl);
  }

  create(data: CreateApiKeyRequest): Observable<ApiKeyResponse> {
    return this.http.post<ApiKeyResponse>(this.apiUrl, data);
  }

  revoke(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}