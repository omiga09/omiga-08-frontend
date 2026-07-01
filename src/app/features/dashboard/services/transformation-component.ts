import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { HeaderTransformationRule, FieldTransformationRule } from '../../../core/models/transformation.model';
import { ApiService } from '../../../core/models/api-service.model';
import { TransformationService } from '../../../core/services/transformation,service';

@Component({
  selector: 'app-transformations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transformation-component.html',
  styleUrl: './transformation-component.scss'
})
export class TransformationsComponent implements OnInit {

  apiServices = signal<ApiService[]>([]);
  selectedServiceId = signal<number | null>(null);

  activeTab = signal<'headers' | 'fields'>('headers');

  headerRules = signal<HeaderTransformationRule[]>([]);
  fieldRules = signal<FieldTransformationRule[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  showHeaderModal = signal(false);
  showFieldModal = signal(false);
  isSaving = signal(false);

  headerForm: FormGroup;
  fieldForm: FormGroup;

  headerTypes = [
    'ADD_REQUEST_HEADER',
    'REMOVE_REQUEST_HEADER',
    'ADD_RESPONSE_HEADER',
    'REMOVE_RESPONSE_HEADER'
  ];

  constructor(
    private transformationService: TransformationService,
    private apiServiceService: ApiServiceService,
    private fb: FormBuilder
  ) {
    this.headerForm = this.fb.group({
      type: ['ADD_REQUEST_HEADER', Validators.required],
      headerName: ['', Validators.required],
      headerValue: ['']
    });

    this.fieldForm = this.fb.group({
      sourceFieldName: ['', Validators.required],
      targetFieldName: ['', Validators.required],
      applyToRequest: [false],
      applyToResponse: [false]
    });
  }

  ngOnInit(): void {
    this.apiServiceService.getAll().subscribe({
      next: (services) => {
        this.apiServices.set(services);
        if (services.length > 0) {
          this.selectedServiceId.set(services[0].id);
          this.loadRules();
        }
      }
    });
  }

  onServiceChange(serviceId: number): void {
  this.selectedServiceId.set(serviceId);
  this.loadRules();
}

switchTab(tab: 'headers' | 'fields'): void {
  this.activeTab.set(tab);
}

loadRules(): void {
  const serviceId = this.selectedServiceId();
  if (!serviceId) return;

  this.isLoading.set(true);

  this.transformationService.getHeaderRules(serviceId).subscribe({
    next: (data) => {
      this.headerRules.set(data);
      this.isLoading.set(false);
    },
    error: () => this.isLoading.set(false)
  });

  this.transformationService.getFieldRules(serviceId).subscribe({
    next: (data) => this.fieldRules.set(data)
  });
}

openHeaderModal(): void {
  this.headerForm.reset({ type: 'ADD_REQUEST_HEADER' });
  this.showHeaderModal.set(true);
}

closeHeaderModal(): void {
  this.showHeaderModal.set(false);
}

onSubmitHeader(): void {
  if (this.headerForm.invalid) {
    this.headerForm.markAllAsTouched();
    return;
  }

  const serviceId = this.selectedServiceId();
  if (!serviceId) return;

  this.isSaving.set(true);

  const payload = { apiServiceId: serviceId, ...this.headerForm.value };

  this.transformationService.createHeaderRule(payload).subscribe({
    next: () => {
      this.isSaving.set(false);
      this.showHeaderModal.set(false);
      this.loadRules();
    },
    error: (err) => {
      this.isSaving.set(false);
      this.errorMessage.set(err.error?.error || 'Failed to create header rule');
    }
  });
}

deleteHeaderRule(rule: HeaderTransformationRule): void {
  this.transformationService.deleteHeaderRule(rule.id).subscribe({
    next: () => this.loadRules(),
    error: () => this.errorMessage.set('Failed to delete rule')
  });
}

openFieldModal(): void {
  this.fieldForm.reset({ applyToRequest: false, applyToResponse: false });
  this.showFieldModal.set(true);
}

closeFieldModal(): void {
  this.showFieldModal.set(false);
}

onSubmitField(): void {
  if (this.fieldForm.invalid) {
    this.fieldForm.markAllAsTouched();
    return;
  }

  const serviceId = this.selectedServiceId();
  if (!serviceId) return;

  const formValue = this.fieldForm.value;
  if (!formValue.applyToRequest && !formValue.applyToResponse) {
    this.errorMessage.set('Select at least one: Apply to Request or Response');
    return;
  }

  this.isSaving.set(true);

  const payload = { apiServiceId: serviceId, ...formValue };

  this.transformationService.createFieldRule(payload).subscribe({
    next: () => {
      this.isSaving.set(false);
      this.showFieldModal.set(false);
      this.loadRules();
    },
    error: (err) => {
      this.isSaving.set(false);
      this.errorMessage.set(err.error?.error || 'Failed to create field rule');
    }
  });
}

deleteFieldRule(rule: FieldTransformationRule): void {
  this.transformationService.deleteFieldRule(rule.id).subscribe({
    next: () => this.loadRules(),
    error: () => this.errorMessage.set('Failed to delete rule')
  });
}
}