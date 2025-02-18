export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'brand' | 'research' | 'creative' | 'gtm';
  complexity: 'simple' | 'advanced';
  requiresAdvancedReasoning: boolean;
  type: string;
  model: string;
  contextPrompt?: string;
}

export interface TemplateExecution {
  templateId: string;
  inputs: Record<string, any>;
  creativityLevel: number;
  modelType: string;
} 