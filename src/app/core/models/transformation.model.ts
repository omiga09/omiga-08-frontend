export interface HeaderTransformationRule {
  id: number;
  type: string;
  headerName: string;
  headerValue: string | null;
  active: boolean;
}

export interface CreateHeaderRuleRequest {
  apiServiceId: number;
  type: string;
  headerName: string;
  headerValue?: string;
}

export interface FieldTransformationRule {
  id: number;
  sourceFieldName: string;
  targetFieldName: string;
  applyToRequest: boolean;
  applyToResponse: boolean;
  active: boolean;
}

export interface CreateFieldRuleRequest {
  apiServiceId: number;
  sourceFieldName: string;
  targetFieldName: string;
  applyToRequest: boolean;
  applyToResponse: boolean;
}