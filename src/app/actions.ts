"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
const pdf = require("pdf-parse-new");
import { ResumeContent } from "@/types/resume";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export async function parseResumeAction(formData: FormData): Promise<ResumeContent | null> {
  const file = formData.get("file") as File;
  if (!file) {
    console.error("No file provided");
    return null;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanJson) as ResumeContent;

  } catch (error) {
    console.error("Error parsing resume:", error);
    return null;
  }
}

export async function tailorResumeAction(currentResume: ResumeContent, jobDescription: string): Promise<ResumeContent | null> {
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanJson) as ResumeContent;

  } catch (error) {
    console.error("Error tailoring resume:", error);
    return null;
  }
}
