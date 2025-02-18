interface Template {
  id: string;
  category: TemplateCategory; // Brand, Research, Creative, GTM
  name: string;
  description: string;
  requiredInputs: InputField[];
  creativityScale: number; // 1-10 scale for Solid to Unexpected
}

interface TemplateExecution {
  templateId: string;
  inputs: Record<string, any>;
  clientRepoId: string;
  creativityLevel: number;
}

class TemplateService {
  async executeTemplate(execution: TemplateExecution): Promise<AIResponse> {
    const template = await this.getTemplate(execution.templateId);
    const relevantContext = await this.repositoryService.searchSimilarContent(
      this.buildContextQuery(execution),
      execution.clientRepoId
    );
    
    return this.aiService.generateResponse({
      template,
      inputs: execution.inputs,
      context: relevantContext,
      creativityLevel: execution.creativityLevel
    });
  }
} 