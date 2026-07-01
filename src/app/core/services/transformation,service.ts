import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  HeaderTransformationRule,
  CreateHeaderRuleRequest,
  FieldTransformationRule,
  CreateFieldRuleRequest
} from '../models/transformation.model';


@Injectable({
  providedIn: 'root'
})
export class TransformationService {

  private apiUrl = `${environment.apiUrl}/transformations`;

  constructor(private http: HttpClient) { }

  getHeaderRules(apiServiceId: number): Observable<HeaderTransformationRule[]> {
    return this.http.get<HeaderTransformationRule[]>(`${this.apiUrl}/service/${apiServiceId}`);
  }

  createHeaderRule(data: CreateHeaderRuleRequest): Observable<HeaderTransformationRule> {
    return this.http.post<HeaderTransformationRule>(this.apiUrl, data);
  }

  deleteHeaderRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFieldRules(apiServiceId: number): Observable<FieldTransformationRule[]> {
    return this.http.get<FieldTransformationRule[]>(`${this.apiUrl}/fields/service/${apiServiceId}`);
  }

  createFieldRule(data: CreateFieldRuleRequest): Observable<FieldTransformationRule> {
    return this.http.post<FieldTransformationRule>(`${this.apiUrl}/fields`, data);
  }

  deleteFieldRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fields/${id}`);
  }
}