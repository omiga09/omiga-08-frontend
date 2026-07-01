export interface ApiDocumentation {
  name: string;
  version: string;
  basePath: string;
  description: string | null;
  allowedMethods: string[];
  fullGatewayUrl: string;
  requiresApiKey: boolean;
}