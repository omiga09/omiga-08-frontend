import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RateLimitService } from '../../../core/services/rate-limit.service';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { RateLimit } from '../../../core/models/rate-limit.model';
import { ApiService } from '../../../core/models/api-service.model';


@Component({
  selector: 'app-rate-limits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rate-limits-component.html',
  styleUrl: './rate-limits-component.scss'
})
export class RateLimitsComponent implements OnInit {

  rateLimits = signal<RateLimit[]>([]);
  apiServices = signal<ApiService[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  showCreateModal = signal(false);
  isSaving = signal(false);
  createForm: FormGroup;

  showDeleteConfirm = signal(false);
  rateLimitToDelete = signal<RateLimit | null>(null);

  constructor(
    private rateLimitService: RateLimitService,
    private apiServiceService: ApiServiceService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      apiServiceId: ['', Validators.required],
      maxRequests: [100, [Validators.required, Validators.min(1)]],
      windowSeconds: [60, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadRateLimits();
    this.loadServices();
  }

  loadRateLimits(): void {
    this.isLoading.set(true);
    this.rateLimitService.getAll().subscribe({
      next: (data) => {
        this.rateLimits.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load rate limits');
        this.isLoading.set(false);
      }
    });
  }

  loadServices(): void {
    this.apiServiceService.getAll().subscribe({
      next: (data) => this.apiServices.set(data)
    });
  }

  openCreateModal(): void {
    this.createForm.reset({ maxRequests: 100, windowSeconds: 60 });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.rateLimitService.createOrUpdate(this.createForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showCreateModal.set(false);
        this.loadRateLimits();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.error || 'Failed to save rate limit');
      }
    });
  }

  toggleActive(rateLimit: RateLimit): void {
    this.rateLimitService.toggleActive(rateLimit.id).subscribe({
      next: () => this.loadRateLimits(),
      error: () => this.errorMessage.set('Failed to update rate limit')
    });
  }

  confirmDelete(rateLimit: RateLimit): void {
    this.rateLimitToDelete.set(rateLimit);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.rateLimitToDelete.set(null);
  }

  executeDelete(): void {
    const rateLimit = this.rateLimitToDelete();
    if (!rateLimit) return;

    this.rateLimitService.delete(rateLimit.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.rateLimitToDelete.set(null);
        this.loadRateLimits();
      },
      error: () => {
        this.errorMessage.set('Failed to delete rate limit');
        this.showDeleteConfirm.set(false);
      }
    });
  }
}