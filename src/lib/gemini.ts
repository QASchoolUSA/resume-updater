import { GoogleGenerativeAI } from "@google/generative-ai";

// We will use an environment variable for the key.
// The user has not provided it yet, but we will set up the client to be ready.
const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
