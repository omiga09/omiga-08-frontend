import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateApiServiceRequest } from '../../../core/models/api-service.model';
import { CreateServiceStateService } from '../../../core/services/create-service-state-service';
import { ApiServiceService } from '../../../core/services/api-service.service';


@Component({
  selector: 'app-advanced-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-setting-component.html',
  styleUrl: './advanced-setting-component.scss'
})
export class AdvancedSettings implements OnInit {

  advancedForm: FormGroup;
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  isEditMode = false;

  availableMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  visibilityOptions = ['PUBLIC', 'PRIVATE'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private stateService: CreateServiceStateService,
    private apiServiceService: ApiServiceService
  ) {
    this.advancedForm = this.fb.group({
      visibility: ['PRIVATE'],
      healthCheckUrl: [''],
      connectTimeoutMs: [5000],
      readTimeoutMs: [10000],
      selectedMethods: this.fb.group({
        GET: [true],
        POST: [false],
        PUT: [false],
        DELETE: [false],
        PATCH: [false]
      })
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.stateService.isEditMode();

    const draft = this.stateService.getDraft();

    if (!draft.name || !draft.basePath) {
      this.redirectToBasic();
      return;
    }

    const methodsState: any = { GET: false, POST: false, PUT: false, DELETE: false, PATCH: false };
    (draft.allowedMethods || []).forEach(m => methodsState[m] = true);

    if (draft.allowedMethods && draft.allowedMethods.length > 0) {
      this.advancedForm.patchValue({
        visibility: draft.visibility || 'PRIVATE',
        healthCheckUrl: draft.healthCheckUrl || '',
        connectTimeoutMs: draft.connectTimeoutMs || 5000,
        readTimeoutMs: draft.readTimeoutMs || 10000,
        selectedMethods: methodsState
      });
    }
  }

  redirectToBasic(): void {
    if (this.isEditMode) {
      this.router.navigate(['/dashboard/services/edit', this.stateService.editingId(), 'basic']);
    } else {
      this.router.navigate(['/dashboard/services/create/basic']);
    }
  }

  goBack(): void {
    this.stateService.updateDraft(this.advancedForm.value);
    this.redirectToBasic();
  }

  onSubmit(): void {
    const formValue = this.advancedForm.value;
    const selectedMethods = Object.keys(formValue.selectedMethods)
      .filter(method => formValue.selectedMethods[method]);

    if (selectedMethods.length === 0) {
      this.errorMessage.set('Please select at least one HTTP method');
      return;
    }

    const draft = this.stateService.getDraft();

    const payload: CreateApiServiceRequest = {
      name: draft.name!,
      version: draft.version,
      basePath: draft.basePath!,
      backendUrl: draft.backendUrl!,
      description: draft.description,
      allowedMethods: selectedMethods,
      visibility: formValue.visibility,
      healthCheckUrl: formValue.healthCheckUrl,
      connectTimeoutMs: formValue.connectTimeoutMs,
      readTimeoutMs: formValue.readTimeoutMs
    };

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const editingId = this.stateService.editingId();

    const request$ = this.isEditMode && editingId
      ? this.apiServiceService.update(editingId, payload)
      : this.apiServiceService.create(payload);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.stateService.reset();
        this.router.navigate(['/dashboard/services']);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.error || 'Failed to save service');
      }
    });
  }
}