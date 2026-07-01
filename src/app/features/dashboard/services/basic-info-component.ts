import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateServiceStateService } from '../../../core/services/create-service-state-service';
import { ApiServiceService } from '../../../core/services/api-service.service';


@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './basic-info-component.html',
  styleUrl: './basic-info-component.scss'
})
export class BasicInfo implements OnInit {

  basicForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stateService: CreateServiceStateService,
    private apiServiceService: ApiServiceService
  ) {
    this.basicForm = this.fb.group({
      name: ['', Validators.required],
      version: ['v1', Validators.required],
      basePath: ['', [Validators.required, Validators.pattern(/^\/[a-zA-Z0-9-_/]*$/)]],
      backendUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      const serviceId = Number(idParam);
      this.stateService.setEditingId(serviceId);
      this.loadExistingService(serviceId);
    } else {
      const existingDraft = this.stateService.getDraft();
      this.basicForm.patchValue(existingDraft);
    }
  }

  loadExistingService(id: number): void {
    this.apiServiceService.getAll().subscribe({
      next: (services) => {
        const service = services.find(s => s.id === id);
        if (service) {
          this.basicForm.patchValue(service);
          this.stateService.updateDraft({
       ...service,
         description: service.description ?? undefined,
         healthCheckUrl: service.healthCheckUrl ?? undefined
});
        }
      }
    });
  }

  onContinue(): void {
    if (this.basicForm.invalid) {
      this.basicForm.markAllAsTouched();
      return;
    }

    this.stateService.updateDraft(this.basicForm.value);

    if (this.isEditMode) {
      this.router.navigate(['/dashboard/services/edit', this.stateService.editingId(), 'advanced']);
    } else {
      this.router.navigate(['/dashboard/services/create/advanced']);
    }
  }

  onCancel(): void {
    this.stateService.reset();
    this.router.navigate(['/dashboard/services']);
  }
}