export interface ApiService {
  id: number;
  name: string;
  version: string;
  basePath: string;
  backendUrl: string;
  description: string | null;
  allowedMethods: string[];
  visibility: string;
  healthCheckUrl: string | null;
  connectTimeoutMs: number;
  readTimeoutMs: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiServiceRequest {
  name: string;
  version?: string;
  basePath: string;
  backendUrl: string;
  description?: string;
  allowedMethods: string[];
  visibility?: string;
  healthCheckUrl?: string;
  connectTimeoutMs?: number;
  readTimeoutMs?: number;
}