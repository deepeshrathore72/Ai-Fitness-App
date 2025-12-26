import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a default quote if API is not configured
      return NextResponse.json({
        quote: "The only bad workout is the one that didn't happen.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });


    // Add timestamp to ensure different quotes each time
    const timestamp = Date.now();
    const seed = Math.floor(Math.random() * 1000);

    const prompt = `Generate a unique, powerful motivational fitness quote for today. Make it inspiring, actionable, and related to health, fitness, or personal growth. The quote should be short (1-2 sentences maximum) and impactful. Generate a completely different quote each time. Random seed: ${seed}, timestamp: ${timestamp}. Return only the quote text without quotation marks, author names, or any formatting.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Clean up the quote (remove quotes if present)
    const cleanedQuote = response.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({ quote: cleanedQuote });
  } catch (error) {
    console.error('Error generating motivation quote:', error);
    
    // Fallback quotes with variety
    const fallbackQuotes = [
      "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
      "The only bad workout is the one that didn't happen.",
      "Your body can stand almost anything. It's your mind that you have to convince.",
      "Don't wish for it, work for it.",
      "Push yourself because no one else is going to do it for you.",
      "Great things never come from comfort zones.",
      "The pain you feel today will be the strength you feel tomorrow.",
      "Your only limit is you.",
    ];

    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    return NextResponse.json({ quote: randomQuote });
  }
}
