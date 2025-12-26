// If running locally, you must first run: npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testKey() {
  const apiKey = "AIzaSyDt1wA21XQgt0N4LFjoPrrNnG2NCr3_uYM"; // Use a variable, don't hardcode if sharing
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error.message);
    } else {
      console.log("Success! Available models:", data.models.map(m => m.name));
    }
  } catch (e) {
    console.error("Connection Error:", e);
  }
}

testKey();