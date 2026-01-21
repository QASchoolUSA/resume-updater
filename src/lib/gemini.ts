import { GoogleGenAI } from "@google/genai";

// Initialize the client
export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Since the new SDK structure is different (genAI.models.generateContent), 
// exporting a single model instance might be less useful than exporting the client itself.
// But we can keep a helper if needed, or just export the client.

// For now, let's just export the client as we are using it directly in actions.ts
// If other components use this file, we might need to adjust.
