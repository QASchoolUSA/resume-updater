"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { ResumeContent } from "@/types/resume";
import { ActionResult } from "@/types/result";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// Helper for Robust AI Calls with Retry and Timeout
async function generateWithRetry(prompt: string, retries = 5, initialDelay = 2000, timeoutMs = 30000): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Gemini API call attempt ${i + 1}/${retries}...`);

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API request timed out")), timeoutMs)
      );

      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ]);

      // @ts-ignore
      const response = await result.response;
      return response.text();

    } catch (error) {
      const isLastAttempt = i === retries - 1;
      console.warn(`Gemini API attempt ${i + 1} failed:`, error instanceof Error ? error.message : error);

      if (isLastAttempt) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, i); // Exponential backoff (1s, 2s, 4s)
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Gemini API failed after max retries");
}

export async function parseResumeAction(formData: FormData): Promise<ActionResult<ResumeContent>> {
  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();



    // Polyfill for Vercel/Node environment where DOMMatrix/Canvas is missing
    if (typeof (global as any).DOMMatrix === 'undefined') {
      // @ts-ignore
      (global as any).DOMMatrix = class DOMMatrix {
        constructor() { return this; }
        multiply() { return this; }
        translate() { return this; }
        scale() { return this; }
        transformPoint() { return { x: 0, y: 0 }; }
      };
    }

    if (typeof (global as any).Canvas === 'undefined') {
      // @ts-ignore
      (global as any).Canvas = class Canvas {
        getContext() {
          return {
            measureText: () => ({ width: 0 }),
            fillText: () => { },
            strokeText: () => { },
            fillRect: () => { },
            strokeRect: () => { },
            beginPath: () => { },
            moveTo: () => { },
            lineTo: () => { },
            stroke: () => { },
            fill: () => { },
            save: () => { },
            restore: () => { },
            scale: () => { },
            rotate: () => { },
            translate: () => { },
            transform: () => { },
            setTransform: () => { },
            resetTransform: () => { },
            createPattern: () => { },
            createLinearGradient: () => { },
          };
        }
      };
    }

    // Use pdfjs-dist to parse - Dynamic import for ESM support (Standard build)
    // @ts-ignore
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist/build/pdf.mjs");

    // Point to the worker file in node_modules so Vercel can find it
    // We use serverExternalPackages in next.config.ts to ensure this file exists at runtime
    const path = require("path");
    // Use the standard worker for the standard build
    GlobalWorkerOptions.workerSrc = path.join(process.cwd(), "node_modules/pdfjs-dist/build/pdf.worker.mjs");

    // This is required for Next.js server environment to handle the worker properly or disable it
    const loadingTask = getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDocument = await loadingTask.promise;
    let text = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      text += pageText + "\n";
    }

    console.log(`Extracted text length: ${text.length}`);
    if (text.trim().length === 0) {
      throw new Error("Unable to extract text from this PDF. It might be an image-only PDF or protected.");
    }

    const prompt = `
      You are an expert resume parser. Extract the following information from the resume text below and return it as a pure JSON object.
      Do not include markdown formatting (like \`\`\`json). Just return the raw JSON.
      
      The JSON structure must match this interface:
      {
        "profile": {
          "name": "string",
          "email": "string",
          "phone": "string",
          "location": "string",
          "website": "string (optional)",
          "linkedin": "string (optional)",
          "github": "string (optional)"
        },
        "summary": "string",
        "experience": [
          {
            "company": "string",
            "role": "string",
            "startDate": "string",
            "endDate": "string",
            "location": "string",
            "description": ["string", "string"]
          }
        ],
        "education": [
          {
            "school": "string",
            "degree": "string",
            "graduationDate": "string",
            "gpa": "string (optional)"
          }
        ],
        "skills": [
          {
            "category": "string",
            "items": ["string", "string"]
          }
        ],
        "projects": [
           {
            "name": "string",
            "description": "string",
            "technologies": ["string"],
            "link": "string (optional)"
           }
        ]
      }

      RESUME TEXT:
      ${text}
    `;

    const textResponse = await generateWithRetry(prompt);
    console.log("Gemini Response:", textResponse.substring(0, 200) + "...");

    const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return { success: true, data: JSON.parse(cleanJson) as ResumeContent };
    } catch (e) {
      console.error("JSON Parse Error. Raw response:", textResponse);
      throw new Error("Failed to parse AI response. The resume might be too complex or the AI returned invalid data.");
    }

  } catch (error) {
    console.error("Error parsing resume:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown parsing error" };
  }
}

export async function tailorResumeAction(currentResume: ResumeContent, jobDescription: string): Promise<ActionResult<ResumeContent>> {
  try {
    const prompt = `
      You are an expert resume writer and career coach. Your task is to rewrite the provided resume to perfectly match the target Job Description (JD).
      
      TARGET JOB DESCRIPTION:
      ${jobDescription}

      CURRENT RESUME (JSON):
      ${JSON.stringify(currentResume)}

      INSTRUCTIONS:
      1. OPTIMIZE SUMMARY: Rewrite the professional summary to highlight experience relevant to the JD. Include key terms from the JD.
      2. REORDER/REFINE SKILLS: Prioritize skills that appear in the JD. Add relevant skills if they are strongly implied by experience (but do not lie).
      3. ENHANCE EXPERIENCE: Rewrite the bullet points for the work experience. 
         - Use keywords from the JD.
         - Focus on achievements that relate to the JD's requirements.
         - Quantify results where possible (even if estimating based on context, but keep it realistic).
      4. DO NOT INVENT jobs or degrees. Only enhance the description of existing experience.
      5. MATCH THE JSON STRUCTURE EXACTLY.

      Return the result as a pure JSON object matching the same schema as the input.
      Do not include markdown formatting.
    `;

    const textResponse = await generateWithRetry(prompt);

    const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    return { success: true, data: JSON.parse(cleanJson) as ResumeContent };

  } catch (error) {
    console.error("Error tailoring resume:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown tailoring error" };
  }
}
