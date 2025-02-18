import Link from 'next/link';
import { sampleTemplates } from '../../data/sampleTemplates';

export default function TemplatesPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Available Templates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleTemplates.map((template) => (
          <Link 
            href={`/templates/${template.id}`} 
            key={template.id}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-600">{template.description}</p>
            <div className="mt-4">
              <span className="inline-block px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded">
                {template.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 