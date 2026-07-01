import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiDocumentation } from '../models/documentation.model';


@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  private apiUrl = `${environment.apiUrl}/documentation`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiDocumentation[]> {
    return this.http.get<ApiDocumentation[]>(this.apiUrl);
  }
}