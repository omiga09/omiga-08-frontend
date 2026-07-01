import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/models/api-service.model';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-component.html',
  styleUrl: './service-component.scss'
})
export class ServicesList implements OnInit {

  services = signal<ApiService[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  showDeleteConfirm = signal(false);
  serviceToDelete = signal<ApiService | null>(null);

  constructor(
    private apiServiceService: ApiServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading.set(true);
    this.apiServiceService.getAll().subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load services');
        this.isLoading.set(false);
      }
    });
  }

  openCreateService(): void {
    this.router.navigate(['/dashboard/services/create']);
  }

  openEditService(service: ApiService): void {
    this.router.navigate(['/dashboard/services/edit', service.id, 'basic']);
  }

  toggleActive(service: ApiService): void {
    this.apiServiceService.toggleActive(service.id).subscribe({
      next: () => this.loadServices(),
      error: () => this.errorMessage.set('Failed to update service status')
    });
  }

  confirmDelete(service: ApiService): void {
    this.serviceToDelete.set(service);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.serviceToDelete.set(null);
  }

  executeDelete(): void {
    const service = this.serviceToDelete();
    if (!service) return;

    this.apiServiceService.delete(service.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.serviceToDelete.set(null);
        this.loadServices();
      },
      error: () => {
        this.errorMessage.set('Failed to delete service');
        this.showDeleteConfirm.set(false);
      }
    });
  }
}