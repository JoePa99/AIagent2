import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { AIModelType } from '../types/AIModels';

interface AIPromptBuilder {
  buildSystemPrompt(template: Template, context: SearchResult[]): string;
  buildUserPrompt(template: Template, inputs: Record<string, any>): string;
  adjustCreativityLevel(prompt: string, level: number): string;
}

interface LLMProvider {
  complete(params: {
    systemPrompt: string;
    userPrompt: string;
    temperature: number;
    modelType: AIModelType;
  }): Promise<AIResponse>;
}

export class AIService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  // Add other model clients as needed

  constructor(
    private promptBuilder: AIPromptBuilder,
    private llmProvider: LLMProvider,
    private firebase: FirebaseApp,
    config: {
      openaiKey: string;
      anthropicKey: string;
      // other keys...
    }
  ) {
    this.openai = new OpenAI({ apiKey: config.openaiKey });
    this.anthropic = new Anthropic({ apiKey: config.anthropicKey });
  }

  // Use Assistants API for context retrieval
  async getRelevantContext(clientId: string, query: string): Promise<string> {
    const assistant = await this.openai.beta.assistants.retrieve(
      process.env.CONTEXT_ASSISTANT_ID!
    );
    
    const thread = await this.openai.beta.threads.create();
    
    await this.openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Find relevant information for: ${query}`,
    });

    const run = await this.openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Wait for completion and get context
    const messages = await this.waitForCompletion(thread.id, run.id);
    return this.extractContext(messages);
  }

  // Use any model for content generation
  async generateContent(params: {
    template: Template;
    inputs: Record<string, any>;
    context: string;
    modelType: AIModelType;
    creativityLevel: number;
  }): Promise<string> {
    const { template, inputs, context, modelType, creativityLevel } = params;
    
    switch (modelType) {
      case AIModelType.GPT35:
      case AIModelType.GPT4:
        return this.generateWithOpenAI(template, inputs, context, modelType, creativityLevel);
      
      case AIModelType.CLAUDE:
        return this.generateWithClaude(template, inputs, context, creativityLevel);
      
      // Add other models as needed
      
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  private async generateWithOpenAI(
    template: Template,
    inputs: Record<string, any>,
    context: string,
    modelType: AIModelType,
    creativityLevel: number
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: modelType,
      messages: [
        {
          role: 'system',
          content: this.buildSystemPrompt(template, context)
        },
        {
          role: 'user',
          content: this.buildUserPrompt(template, inputs, creativityLevel)
        }
      ],
      temperature: this.mapCreativityToTemperature(creativityLevel)
    });

    return response.choices[0].message.content || '';
  }

  private async generateWithClaude(
    template: Template,
    inputs: Record<string, any>,
    context: string,
    creativityLevel: number
  ): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      system: this.buildSystemPrompt(template, context),
      messages: [{
        role: 'user',
        content: this.buildUserPrompt(template, inputs, creativityLevel)
      }],
      temperature: this.mapCreativityToTemperature(creativityLevel)
    });

    return response.content[0].text;
  }

  private buildSystemPrompt(template: Template, context: string): string {
    return `${template.systemPrompt}\n\nRelevant context:\n${context}`;
  }

  private buildUserPrompt(
    template: Template,
    inputs: Record<string, any>,
    creativityLevel: number
  ): string {
    // Replace template variables with inputs
    let prompt = template.userPrompt;
    for (const [key, value] of Object.entries(inputs)) {
      prompt = prompt.replace(`{{${key}}}`, value);
    }
    
    // Add creativity guidance
    const creativityGuidance = creativityLevel <= 5 
      ? 'Focus on proven, conventional approaches.'
      : 'Feel free to be more innovative and unexpected in your response.';
    
    return `${prompt}\n\n${creativityGuidance}`;
  }

  private mapCreativityToTemperature(creativityLevel: number): number {
    // Map 1-10 creativity to 0-2 temperature
    return (creativityLevel - 1) * (2 / 9);
  }
} 