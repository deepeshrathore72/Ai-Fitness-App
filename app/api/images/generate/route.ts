import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, type } = body; // type: 'exercise' or 'meal'

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check which image generation service is configured
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Try Gemini Imagen first (if available)
    if (geminiKey) {
      try {
        return await generateWithGemini(prompt, type, geminiKey);
      } catch (error) {
        console.error('Gemini image generation failed, trying alternatives:', error);
      }
    }

    // Try OpenAI DALL-E
    if (openaiKey) {
      try {
        return await generateWithOpenAI(prompt, type, openaiKey);
      } catch (error) {
        console.error('OpenAI image generation failed, trying alternatives:', error);
      }
    }

    // Try Replicate
    if (replicateToken) {
      try {
        return await generateWithReplicate(prompt, type, replicateToken);
      } catch (error) {
        console.error('Replicate image generation failed:', error);
      }
    }

    return NextResponse.json(
      { error: 'No image generation API configured. Please set GEMINI_API_KEY, OPENAI_API_KEY, or REPLICATE_API_TOKEN' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateWithGemini(prompt: string, type: string, apiKey: string) {
  // Note: Gemini Imagen may require specific setup
  // For now, we'll use a text description approach
  const genAI = new GoogleGenerativeAI(apiKey);
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const model = genAI.getGenerativeModel({ model: 'imagen-4.0-fast-generate-001' });


  const enhancedPrompt = type === 'exercise'
    ? `Generate a detailed visual description for this exercise: ${prompt}. Describe it as if creating a realistic gym/fitness photograph.`
    : `Generate a detailed visual description for this meal: ${prompt}. Describe it as if creating a professional food photograph.`;

  const result = await model.generateContent(enhancedPrompt);
  const description = result.response.text();

  // Return description instead of actual image
  // You can enhance this with actual image generation API when available
  return NextResponse.json({
    type: 'description',
    description,
    prompt,
  });
}

async function generateWithOpenAI(prompt: string, type: string, apiKey: string) {
  const enhancedPrompt = type === 'exercise'
    ? `A realistic photograph of a person performing ${prompt} exercise in a gym setting, professional fitness photography, high quality, detailed`
    : `A professional food photograph of ${prompt}, appetizing, well-lit, high quality, restaurant-style plating`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${errorData}`);
  }

  const data = await response.json();
  return NextResponse.json({
    type: 'image',
    imageUrl: data.data[0].url,
    prompt,
  });
}

async function generateWithReplicate(prompt: string, type: string, token: string) {
  const enhancedPrompt = type === 'exercise'
    ? `A realistic photograph of a person performing ${prompt} exercise in a gym setting, professional fitness photography, high quality, detailed`
    : `A professional food photograph of ${prompt}, appetizing, well-lit, high quality, restaurant-style plating`;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify({
      version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4', // Stable Diffusion
      input: {
        prompt: enhancedPrompt,
        num_outputs: 1,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Replicate API error: ${errorData}`);
  }

  const prediction = await response.json();

  // Poll for result
  let imageUrl = null;
  let attempts = 0;
  const maxAttempts = 30;

  while (!imageUrl && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const statusResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          'Authorization': `Token ${token}`,
        },
      }
    );

    const statusData = await statusResponse.json();

    if (statusData.status === 'succeeded') {
      imageUrl = statusData.output[0];
    } else if (statusData.status === 'failed') {
      throw new Error('Image generation failed');
    }

    attempts++;
  }

  if (!imageUrl) {
    throw new Error('Image generation timed out');
  }

  return NextResponse.json({
    type: 'image',
    imageUrl,
    prompt,
  });
}
