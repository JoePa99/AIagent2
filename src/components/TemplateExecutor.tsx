import React, { useState } from 'react';
import { Template } from '../types/Template';
import { ModelSelector, AIModelType } from './ModelSelector';

interface TemplateExecutorProps {
  template: Template;
}

export const TemplateExecutor: React.FC<TemplateExecutorProps> = ({
  template
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.GPT35);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creativityLevel, setCreativityLevel] = useState(5);
  const [context, setContext] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
          model: selectedModel,
          creativityLevel,
          context
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate content');
      }

      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ModelSelector
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        disabled={loading}
      />

      {template.contextPrompt && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Context
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={template.contextPrompt}
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Creativity Level
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={creativityLevel}
          onChange={(e) => setCreativityLevel(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Solid</span>
          <span>Unexpected</span>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md ${
          loading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}; 