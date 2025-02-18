import { Template } from '../types/Template';

export const sampleTemplates: Template[] = [
  {
    id: 'brand-voice',
    name: 'Brand Voice Guide',
    description: 'Create a comprehensive brand voice guide including tone, vocabulary, and examples.',
    category: 'brand',
    complexity: 'simple',
    requiresAdvancedReasoning: false,
    type: 'content',
    model: 'gpt-3.5-turbo'
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Analyze key competitors and identify market opportunities.',
    category: 'research',
    complexity: 'simple',
    requiresAdvancedReasoning: false
  }
]; 