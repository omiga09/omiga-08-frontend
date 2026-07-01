export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  companyName: string;
  companyEmail: string;
  contactPerson?: string;
  adminEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
  companyName: string;
  companySlug: string;
  expiresInSeconds: number;
}

export interface RegisterResponse {
  companyId: number;
  companyName: string;
  companySlug: string;
  adminEmail: string;
  message: string;
}