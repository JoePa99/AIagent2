import OpenAI from 'openai';
import { ClientDocument } from '../types/Client';

export class AssistantService {
  private openai: OpenAI;
  private assistantId: string | null = null;

  constructor(config: { openaiKey: string }) {
    this.openai = new OpenAI({ apiKey: config.openaiKey });
  }

  async initializeAssistant() {
    try {
      const response = await fetch('/api/assistant/initialize', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize assistant');
      }

      const data = await response.json();
      this.assistantId = data.assistantId;
      return this.assistantId;
    } catch (error) {
      console.error('Error initializing assistant:', error);
      throw error;
    }
  }

  async addDocumentToAssistant(document: ClientDocument) {
    if (!document.content) {
      throw new Error('Document has no content');
    }

    const formData = new FormData();
    formData.append('file', new Blob([document.content], { type: 'text/plain' }));
    formData.append('assistantId', this.assistantId || '');

    const response = await fetch('/api/assistant/add-document', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add document');
    }

    const data = await response.json();
    return data.fileId;
  }

  async queryContext(query: string, clientId: string): Promise<string> {
    const response = await fetch('/api/assistant/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        clientId,
        assistantId: this.assistantId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to query context');
    }

    const data = await response.json();
    return data.result;
  }
} 