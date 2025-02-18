import { useState, useCallback } from 'react';
import { ClientDocument } from '../types/Client';

export function useAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);

  const initializeAssistant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assistant/initialize', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize assistant');
      }

      const data = await response.json();
      setAssistantId(data.assistantId);
      return data.assistantId;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const addDocument = useCallback(async (document: ClientDocument) => {
    if (!assistantId) {
      throw new Error('Assistant not initialized');
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', new Blob([document.content], { type: 'text/plain' }));
      formData.append('assistantId', assistantId);

      const response = await fetch('/api/assistant/add-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add document');
      }

      const data = await response.json();
      return data.fileId;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [assistantId]);

  const queryContext = useCallback(async (query: string, clientId: string) => {
    if (!assistantId) {
      throw new Error('Assistant not initialized');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          clientId,
          assistantId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to query context');
      }

      const data = await response.json();
      return data.result;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [assistantId]);

  return {
    initializeAssistant,
    addDocument,
    queryContext,
    loading,
    error,
    assistantId
  };
} 