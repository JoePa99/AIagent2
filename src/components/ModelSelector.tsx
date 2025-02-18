import React from 'react';

export enum AIModelType {
  GPT35 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4-turbo-preview'
}

interface ModelSelectorProps {
  selectedModel: AIModelType;
  onModelChange: (model: AIModelType) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select AI Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as AIModelType)}
        disabled={disabled}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value={AIModelType.GPT35}>GPT-3.5 Turbo - Fast and cost-effective</option>
        <option value={AIModelType.GPT4}>GPT-4 Turbo - Most capable</option>
      </select>
    </div>
  );
}; 