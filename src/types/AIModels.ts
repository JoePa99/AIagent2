export enum AIModelType {
  GPT35 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  CLAUDE = 'claude-3-sonnet',
  DEEPSEEK = 'deepseek-chat'
}

export interface ModelConfig {
  type: AIModelType;
  maxTokens: number;
  costPerToken: number;
  capabilities: {
    functionCalling: boolean;
    jsonMode: boolean;
    visionSupport: boolean;
  };
}

export const MODEL_CONFIGS: Record<AIModelType, ModelConfig> = {
  [AIModelType.GPT35]: {
    type: AIModelType.GPT35,
    maxTokens: 4096,
    costPerToken: 0.0015,
    capabilities: {
      functionCalling: true,
      jsonMode: true,
      visionSupport: false
    }
  },
  // Add other model configurations...
};

export interface ModelOption {
  id: AIModelType;
  name: string;
  description: string;
  useCase: string;
  costEstimate: string;
  speedEstimate: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: AIModelType.GPT35,
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective",
    useCase: "Best for simple tasks and quick iterations",
    costEstimate: "$",
    speedEstimate: "Fast"
  },
  {
    id: AIModelType.GPT4,
    name: "GPT-4",
    description: "More capable and nuanced",
    useCase: "Complex analysis and creative tasks",
    costEstimate: "$$$",
    speedEstimate: "Medium"
  },
  {
    id: AIModelType.CLAUDE,
    name: "Claude 3 Sonnet",
    description: "Highly capable with strong reasoning",
    useCase: "Detailed analysis and long-form content",
    costEstimate: "$$",
    speedEstimate: "Fast"
  }
  // Add other models as needed
]; 