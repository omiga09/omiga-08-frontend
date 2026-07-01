import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationService } from '../../../core/services/documentation.service';
import { ApiDocumentation } from '../../../core/models/documentation.model';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentation-component.html',
  styleUrl: './documentation-component.scss'
})
export class DocumentationComponent implements OnInit {

  docs = signal<ApiDocumentation[]>([]);
  isLoading = signal(true);
  selectedDoc = signal<ApiDocumentation | null>(null);
  copiedUrl = signal(false);

  gatewayBaseUrl = environment.apiUrl.replace('/api', '');

  constructor(private documentationService: DocumentationService) { }

  ngOnInit(): void {
    this.loadDocs();
  }

  loadDocs(): void {
    this.isLoading.set(true);
    this.documentationService.getAll().subscribe({
      next: (data) => {
        this.docs.set(data);
        this.isLoading.set(false);
        if (data.length > 0) {
          this.selectedDoc.set(data[0]);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectDoc(doc: ApiDocumentation): void {
    this.selectedDoc.set(doc);
    this.copiedUrl.set(false);
  }

  getFullUrl(doc: ApiDocumentation): string {
    return this.gatewayBaseUrl + doc.fullGatewayUrl;
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url);
    this.copiedUrl.set(true);
    setTimeout(() => this.copiedUrl.set(false), 2000);
  }

  buildCurlExample(doc: ApiDocumentation): string {
    const method = doc.allowedMethods[0] || 'GET';
    const url = this.getFullUrl(doc);

    if (doc.requiresApiKey) {
      return `curl -X ${method} ${url} \\\n  -H "X-API-Key: YOUR_API_KEY"`;
    }
    return `curl -X ${method} ${url}`;
  }

  exportAsJson(): void {
  const exportData = {
    name: 'OMIGA08 GATEWAY API Documentation',
    generatedAt: new Date().toISOString(),
    baseUrl: this.gatewayBaseUrl,
    services: this.docs().map(doc => ({
      name: doc.name,
      version: doc.version,
      description: doc.description,
      endpoint: this.getFullUrl(doc),
      allowedMethods: doc.allowedMethods,
      requiresApiKey: doc.requiresApiKey,
      authentication: doc.requiresApiKey
        ? { type: 'apiKey', header: 'X-API-Key' }
        : null
    }))
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'omiga08-gateway-api-docs.json';
  link.click();

  window.URL.revokeObjectURL(url);
}
}