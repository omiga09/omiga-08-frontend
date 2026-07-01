import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiKeyService } from '../../../core/services/api-key.service';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { ApiKey } from '../../../core/models/api-key.model';
import { ApiService } from '../../../core/models/api-service.model';


@Component({
  selector: 'app-api-keys',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './api-key-component.html',
  styleUrl: './api-key-component.scss'
})
export class ApiKeysComponent implements OnInit {

  apiKeys = signal<ApiKey[]>([]);
  apiServices = signal<ApiService[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  showCreateModal = signal(false);
  isSaving = signal(false);
  createForm: FormGroup;

  newlyCreatedKey = signal<string | null>(null);

  showRevokeConfirm = signal(false);
  keyToRevoke = signal<ApiKey | null>(null);

  constructor(
    private apiKeyService: ApiKeyService,
    private apiServiceService: ApiServiceService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      apiServiceId: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadKeys();
    this.loadServices();
  }

  loadKeys(): void {
  this.isLoading.set(true);
  this.apiKeyService.getAll().subscribe({
    next: (data) => {
      this.apiKeys.set(data);
      this.isLoading.set(false);
    },
    error: () => {
      this.errorMessage.set('Failed to load API keys');
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
  this.createForm.reset();
  this.newlyCreatedKey.set(null);
  this.showCreateModal.set(true);
}

closeCreateModal(): void {
  this.showCreateModal.set(false);
  this.newlyCreatedKey.set(null);
}

onSubmit(): void {
  if (this.createForm.invalid) {
    this.createForm.markAllAsTouched();
    return;
  }

  this.isSaving.set(true);
  this.errorMessage.set(null);

  this.apiKeyService.create(this.createForm.value).subscribe({
    next: (response) => {
      this.isSaving.set(false);
      this.newlyCreatedKey.set(response.apiKey);
      this.loadKeys();
    },
    error: (err) => {
      this.isSaving.set(false);
      this.errorMessage.set(err.error?.error || 'Failed to create API key');
    }
  });
}

copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

confirmRevoke(key: ApiKey): void {
  this.keyToRevoke.set(key);
  this.showRevokeConfirm.set(true);
}

cancelRevoke(): void {
  this.showRevokeConfirm.set(false);
  this.keyToRevoke.set(null);
}

executeRevoke(): void {
  const key = this.keyToRevoke();
  if (!key) return;

  this.apiKeyService.revoke(key.id).subscribe({
    next: () => {
      this.showRevokeConfirm.set(false);
      this.keyToRevoke.set(null);
      this.loadKeys();
    },
    error: () => {
      this.errorMessage.set('Failed to revoke API key');
      this.showRevokeConfirm.set(false);
    }
  });
}
}