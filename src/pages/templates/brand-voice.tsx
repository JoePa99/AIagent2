import React from 'react';
import { TemplateExecutor } from '../../components/TemplateExecutor';

const brandVoiceTemplate = {
  id: 'brand-voice',
  name: 'Brand Voice Guide',
  description: 'Create a comprehensive brand voice guide including tone, vocabulary, and examples.',
  type: 'content',
  model: 'gpt-3.5-turbo'
};

export default function BrandVoicePage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Brand Voice Guide</h1>
      <p className="text-gray-600 mb-8">
        Create a comprehensive brand voice guide including tone, vocabulary, and examples.
      </p>
      
      <TemplateExecutor template={brandVoiceTemplate} />
    </div>
  );
} 