import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { RequestLog, AnalyticsSummary } from '../../../core/models/analytics.model';


@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-component.html',
  styleUrl: './analytics-component.scss'
})
export class AnalyticsComponent implements OnInit {

  summary = signal<AnalyticsSummary | null>(null);
  logs = signal<RequestLog[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  currentPage = signal(0);
  pageSize = 20;
  totalPages = signal(0);
  totalElements = signal(0);

  timeRangeHours = signal(24);

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadSummary();
    this.loadLogs();
  }

  loadSummary(): void {
  this.analyticsService.getSummary(this.timeRangeHours()).subscribe({
    next: (data) => this.summary.set(data),
    error: () => {}
  });
}

loadLogs(): void {
  this.isLoading.set(true);
  this.analyticsService.getLogs(this.currentPage(), this.pageSize).subscribe({
    next: (data) => {
      this.logs.set(data.content);
      this.totalPages.set(data.totalPages);
      this.totalElements.set(data.totalElements);
      this.isLoading.set(false);
    },
    error: () => {
      this.errorMessage.set('Failed to load logs');
      this.isLoading.set(false);
    }
  });
}

changeTimeRange(hours: number): void {
  this.timeRangeHours.set(hours);
  this.loadSummary();
}

goToPage(page: number): void {
  if (page < 0 || page >= this.totalPages()) return;
  this.currentPage.set(page);
  this.loadLogs();
}

nextPage(): void {
  this.goToPage(this.currentPage() + 1);
}

previousPage(): void {
  this.goToPage(this.currentPage() - 1);
}

getStatusClass(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return 'status-success';
  if (statusCode >= 400 && statusCode < 500) return 'status-warning';
  if (statusCode >= 500) return 'status-danger';
  return 'status-neutral';
}

formatDateTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
}
  