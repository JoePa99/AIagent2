import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, clientId, assistantId } = req.body;

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY
    });

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add the message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `For client ${clientId}, ${query}`,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed: ' + runStatus.last_error);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const result = messages.data[0].content[0];

    if (result.type !== 'text') {
      throw new Error('Unexpected response type from assistant');
    }

    return res.status(200).json({ result: result.text.value });
  } catch (error) {
    console.error('Error querying context:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to query context' 
    });
  }
} 