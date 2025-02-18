import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log environment state
    console.log('Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7)
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize OpenAI
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false
    });

    // Test connection with a simple API call
    console.log('Testing OpenAI connection...');
    const models = await openai.models.list();
    console.log('OpenAI connection successful, found models:', models.data.length);

    // Create assistant
    console.log('Creating assistant...');
    const assistant = await openai.beta.assistants.create({
      name: "Client Context Assistant",
      description: "Analyzes and retrieves relevant information from client documents",
      model: "gpt-4-turbo-preview",
      tools: [{
        type: "file_search"
      }],
      instructions: `You are a specialized assistant for advertising agencies.`
    });

    console.log('Assistant created successfully:', assistant.id);
    return res.status(200).json({ 
      success: true,
      assistantId: assistant.id 
    });

  } catch (error) {
    // Detailed error logging
    console.error('Error in initialize endpoint:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    });

    return res.status(500).json({
      error: 'Failed to initialize assistant',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 