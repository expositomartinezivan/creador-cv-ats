
import { GoogleGenAI } from "@google/genai";

// Conditionally initialize the AI client to prevent a crash on load.
// In a pure browser environment, `process.env.API_KEY` is not available
// unless injected by a build tool. This change makes the app robust.
const ai = (typeof process !== 'undefined' && process.env && process.env.API_KEY)
  ? new GoogleGenAI({ apiKey: process.env.API_KEY })
  : null;

if (!ai) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

export const generateAtsFriendlyText = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an expert career coach specializing in writing ATS-friendly resumes for young professionals and recent graduates.
        Your goal is to rewrite or generate text that is clear, professional, and uses action verbs.
        Focus on quantifying achievements where possible. The output should be concise and impactful.
        Return ONLY the suggested text, without any introductory phrases like "Here is the suggestion:" or similar.
        The tone should be encouraging and professional.
        `,
        temperature: 0.7,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    throw new Error("Failed to get suggestion from AI. Please try again.");
  }
};
