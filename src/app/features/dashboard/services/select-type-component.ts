import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreateServiceStateService } from '../../../core/services/create-service-state-service';


@Component({
  selector: 'app-select-type',
  standalone: true,
  imports: [],
  templateUrl: './select-type-component.html',
  styleUrl: './select-type-component.scss'
})
export class SelectType {

  constructor(
    private router: Router,
    private stateService: CreateServiceStateService
  ) {
    this.stateService.reset();
  }

  selectRestApi(): void {
    this.router.navigate(['/dashboard/services/create/basic']);
  }
}