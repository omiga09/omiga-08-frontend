import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedLogs, AnalyticsSummary } from '../models/analytics.model';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) { }

  getLogs(page: number, size: number): Observable<PagedLogs> {
    return this.http.get<PagedLogs>(`${this.apiUrl}/logs?page=${page}&size=${size}`);
  }

  getSummary(hours: number): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.apiUrl}/summary?hours=${hours}`);
  }
}