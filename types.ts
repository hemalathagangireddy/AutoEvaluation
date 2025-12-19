
export interface EvaluationResult {
  score: number;
  maxScore: number;
  semanticSimilarity: number;
  keywordCoverage: number;
  contentRelevance: number;
  detailedFeedback: string;
  identifiedKeywords: string[];
  missingKeywords: string[];
  grammarRating: number;
  suggestions: string[];
}

export interface EvaluationRequest {
  question: string;
  modelAnswer: string;
  studentAnswer: string;
}

export interface PastEvaluation extends EvaluationRequest {
  id: string;
  timestamp: number;
  result: EvaluationResult;
}
