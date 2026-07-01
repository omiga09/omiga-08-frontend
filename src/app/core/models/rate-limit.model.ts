export interface RateLimit {
  id: number;
  apiServiceId: number;
  apiServiceName: string;
  maxRequests: number;
  windowSeconds: number;
  active: boolean;
}

export interface CreateRateLimitRequest {
  apiServiceId: number;
  maxRequests: number;
  windowSeconds: number;
}