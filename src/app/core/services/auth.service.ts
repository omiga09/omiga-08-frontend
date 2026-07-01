import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth.model';
import { ForgotPasswordRequest, PasswordResetResponse, ResetPasswordRequest } from '../models/password-reset.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}


  login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      this.storeAuthData(response);
    })
  );
}

  register(data: RegisterRequest): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
}

private storeAuthData(response: LoginResponse): void {
    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('company_name', response.companyName);
    localStorage.setItem('company_slug', response.companySlug);
    localStorage.setItem('user_email', response.email);
    localStorage.setItem('user_role', response.role);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getCompanyName(): string | null {
    return localStorage.getItem('company_name');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('company_name');
    localStorage.removeItem('company_slug');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
  }

forgotPassword(data: ForgotPasswordRequest): Observable<PasswordResetResponse> {
  return this.http.post<PasswordResetResponse>(`${this.apiUrl}/forgot-password`, data);
}

resetPassword(data: ResetPasswordRequest): Observable<PasswordResetResponse> {
  return this.http.post<PasswordResetResponse>(`${this.apiUrl}/reset-password`, data);
}

} 
