import { useRouter } from 'next/router';
import { useState } from 'react';
import { TemplateExecutor } from '../../components/TemplateExecutor';
import { sampleTemplates } from '../../data/sampleTemplates';
import { TemplateExecution } from '../../types/Template';

export default function TemplatePage() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const template = sampleTemplates.find(t => t.id === id);

  const handleExecute = async (params: TemplateExecution) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`Generated content for template "${template?.name}" using ${params.modelType} with creativity level ${params.creativityLevel}`);
    } catch (error) {
      console.error('Error executing template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!template) {
    return <div className="p-8">Template not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{template.name}</h1>
      <p className="text-gray-600 mb-8">{template.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configure Template</h2>
          <TemplateExecutor 
            template={template} 
            onExecute={handleExecute} 
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : result ? (
            <div className="prose">{result}</div>
          ) : (
            <div className="text-gray-500">Configure and execute the template to see results</div>
          )}
        </div>
      </div>
    </div>
  );
} 