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
    const { template, model, creativityLevel, context } = req.body;

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      temperature: creativityLevel / 10, // Convert 1-10 to 0-1
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in brand voice and marketing content."
        },
        ...(context ? [{
          role: "user",
          content: `Context: ${context}`
        }] : []),
        {
          role: "user",
          content: `Create a brand voice guide including tone, vocabulary, and examples. 
            Be ${creativityLevel > 5 ? 'more creative and innovative' : 'more conventional and proven'} in your approach.
            ${template.description}`
        }
      ]
    });

    return res.status(200).json({ 
      content: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 