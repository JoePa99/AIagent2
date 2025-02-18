import { useState, useEffect } from 'react';
import { useAssistant } from '../hooks/useAssistant';

export default function TestPage() {
  const { initializeAssistant, loading, error, assistantId } = useAssistant();
  const [result, setResult] = useState<string>('');

  const testAssistant = async () => {
    try {
      const id = await initializeAssistant();
      setResult(`Assistant initialized with ID: ${id}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OpenAI Assistant Test</h1>
      <button
        onClick={testAssistant}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Assistant'}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {result}
        </pre>
      )}
      {assistantId && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          Assistant ID: {assistantId}
        </div>
      )}
    </div>
  );
} 