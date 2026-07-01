export interface RequestLog {
  requestId: string;
  apiServiceId: number;
  method: string;
  path: string;
  statusCode: number;
  responseTimeMs: number;
  sourceIp: string;
  errorMessage: string | null;
  timestamp: string;
}

export interface PagedLogs {
  content: RequestLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface AnalyticsSummary {
  totalRequests: number;
  errorRequests: number;
  errorRatePercentage: number;
}