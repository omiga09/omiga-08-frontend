import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './dashboard-layout-component.html',
  styleUrl: './dashboard-layout-component.scss'
})
export class DashboardLayout {

  companyName: string | null = null;
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.companyName = this.authService.getCompanyName();
    this.userEmail = localStorage.getItem('user_email');
    this.userRole = localStorage.getItem('user_role');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}