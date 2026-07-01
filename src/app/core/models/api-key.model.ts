export interface ApiKeyResponse {
  apiKey: string;
  warning: string;
}

export interface CreateApiKeyRequest {
  apiServiceId: number;
  name: string;
}

export interface ApiKey {
  id: number;
  name: string;
  keyPrefix: string;
  apiServiceId: number;
  apiServiceName: string;
  active: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}