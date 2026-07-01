import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login-component';
import { Register } from './features/auth/register/register-component';
import { DashboardLayout } from './shared/dashboard-layout/dashboard-layout-component';
import { DashboardHome } from './features/dashboard/home/home-component';
import { authGuard } from './core/guards/auth-guard';
import { ServicesList } from './features/dashboard/services/service-component';
import { SelectType } from './features/dashboard/services/select-type-component';
import { BasicInfo } from './features/dashboard/services/basic-info-component';
import { AdvancedSettings } from './features/dashboard/services/advanced-setting-component';
import { ApiKeysComponent } from './features/dashboard/services/api-key-component';
import { RateLimitsComponent } from './features/dashboard/services/rate-limits-component';
import { TransformationsComponent } from './features/dashboard/services/transformation-component';
import { AnalyticsComponent } from './features/dashboard/services/analytics-component';
import { DocumentationComponent } from './features/dashboard/services/documentation-component';
import { ForgotPasswordComponent } from './core/services/forgot-password-component';
import { ResetPasswordComponent } from './core/services/reset-password-component';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHome },
      { path: 'services', component: ServicesList },
      { path: 'services/create', component: SelectType },
      { path: 'services/create/basic', component: BasicInfo },
      { path: 'services/create/advanced', component: AdvancedSettings },
      { path: 'services/edit/:id/basic', component: BasicInfo },
      { path: 'services/edit/:id/advanced', component: AdvancedSettings },
      { path: 'api-keys', component: ApiKeysComponent },
      { path: 'rate-limits', component: RateLimitsComponent },
      { path: 'transformations', component: TransformationsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'documentation', component: DocumentationComponent }
    ]
  }
];