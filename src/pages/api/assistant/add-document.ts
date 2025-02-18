import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll use Formidable
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY
    });

    // Parse form data
    const form = new FormData(req);
    const file = form.get('file') as File;
    const assistantId = form.get('assistantId') as string;

    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
      file,
      purpose: 'assistants',
    });

    // Associate file with assistant
    await openai.beta.assistants.files.create(
      assistantId,
      { file_id: uploadedFile.id }
    );

    return res.status(200).json({ fileId: uploadedFile.id });
  } catch (error) {
    console.error('Error adding document:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to add document' 
    });
  }
} 