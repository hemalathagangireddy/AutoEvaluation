
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationRequest, EvaluationResult } from "./types";

export const evaluateAnswer = async (data: EvaluationRequest): Promise<EvaluationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Evaluate the following student's descriptive answer for the given question against the provided model answer.
    
    Question: ${data.question}
    Model Answer: ${data.modelAnswer}
    Student's Answer: ${data.studentAnswer}
    
    Please provide a structured evaluation focusing on:
    1. Score: Provide a final mark out of 100 based on the overall quality.
    2. Semantic Similarity: How well the meaning aligns with the model answer (0-100).
    3. Keyword Coverage: Identification of essential technical/conceptual terms (0-100).
    4. Content Relevance: Whether the student stayed on topic (0-100).
    5. Grammar Rating: Basic check of language proficiency (0-100).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Total marks awarded out of 100" },
          semanticSimilarity: { type: Type.NUMBER, description: "Percentage similarity (0-100)" },
          keywordCoverage: { type: Type.NUMBER, description: "Percentage of keywords covered (0-100)" },
          contentRelevance: { type: Type.NUMBER, description: "Percentage of relevance (0-100)" },
          detailedFeedback: { type: Type.STRING, description: "Qualitative feedback on the student's answer" },
          identifiedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          grammarRating: { type: Type.NUMBER, description: "Score for language quality (0-100)" },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific steps to improve the answer" }
        },
        required: ["score", "semanticSimilarity", "keywordCoverage", "contentRelevance", "detailedFeedback", "identifiedKeywords", "missingKeywords", "grammarRating", "suggestions"]
      }
    }
  });

  const result: EvaluationResult = JSON.parse(response.text);
  // Defaulting maxScore to 100 as per user requirement to simplify the evaluation process.
  result.maxScore = 100;
  return result;
};
