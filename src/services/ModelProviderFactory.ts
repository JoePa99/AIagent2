import { Configuration, OpenAIApi } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { DeepSeekAPI } from 'deepseek-api'; // Hypothetical

export class ModelProviderFactory {
  private openai: OpenAIApi;
  private anthropic: Anthropic;
  private deepseek: DeepSeekAPI;

  constructor(
    private config: {
      openaiKey: string;
      anthropicKey: string;
      deepseekKey: string;
    }
  ) {
    this.openai = new OpenAIApi(new Configuration({ apiKey: config.openaiKey }));
    this.anthropic = new Anthropic({ apiKey: config.anthropicKey });
    // Initialize other providers...
  }

  createProvider(modelType: AIModelType): LLMProvider {
    switch (modelType) {
      case AIModelType.GPT35:
      case AIModelType.GPT4:
        return new OpenAIProvider(this.openai);
      case AIModelType.CLAUDE:
        return new ClaudeProvider(this.anthropic);
      case AIModelType.DEEPSEEK:
        return new DeepSeekProvider(this.deepseek);
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }
} 