import { Injectable, signal } from '@angular/core';
import { CreateApiServiceRequest } from '../models/api-service.model';

@Injectable({
  providedIn: 'root'
})
export class CreateServiceStateService {

  draft = signal<Partial<CreateApiServiceRequest>>({});
  editingId = signal<number | null>(null);

  updateDraft(data: Partial<CreateApiServiceRequest>): void {
    this.draft.update(current => ({ ...current, ...data }));
  }

  getDraft(): Partial<CreateApiServiceRequest> {
    return this.draft();
  }

  setEditingId(id: number | null): void {
    this.editingId.set(id);
  }

  isEditMode(): boolean {
    return this.editingId() !== null;
  }

  reset(): void {
    this.draft.set({});
    this.editingId.set(null);
  }
}