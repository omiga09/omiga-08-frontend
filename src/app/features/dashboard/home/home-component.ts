import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface AnalyticsSummary {
  totalRequests: number;
  errorRequests: number;
  errorRatePercentage: number;
}

interface RequestLog {
  requestId: string;
  apiServiceId: number;
  method: string;
  path: string;
  statusCode: number;
  responseTimeMs: number;
  sourceIp: string;
  errorMessage: string | null;
  timestamp: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class DashboardHome implements OnInit {

  summary = signal<AnalyticsSummary | null>(null);
  recentLogs = signal<RequestLog[]>([]);
  isLoading = signal(true);
  companyName: string | null = null;

  constructor(private http: HttpClient) {
    this.companyName = localStorage.getItem('company_name');
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadRecentLogs();
  }

  loadSummary(): void {
    this.http.get<AnalyticsSummary>(`${environment.apiUrl}/analytics/summary?hours=24`)
      .subscribe({
        next: (data) => {
          this.summary.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  loadRecentLogs(): void {
    this.http.get<{ content: RequestLog[] }>(`${environment.apiUrl}/analytics/logs?page=0&size=8`)
      .subscribe({
        next: (data) => {
          this.recentLogs.set(data.content);
        },
        error: () => {
          this.recentLogs.set([]);
        }
      });
  }

  getStatusClass(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'status-success';
    if (statusCode >= 400 && statusCode < 500) return 'status-warning';
    if (statusCode >= 500) return 'status-danger';
    return 'status-neutral';
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}