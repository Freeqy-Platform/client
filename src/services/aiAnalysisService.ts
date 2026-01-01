import { apiClient } from "@/lib/api-client";
import type {
  AiAnalysisRequest,
  TeamStructureResponse,
  TechStackResponse,
  FullAnalysisResponse,
} from "@/types/aiAnalysis";

export const aiAnalysisService = {
  /**
   * POST /api/AiAnalysis/team/generate
   * Generate team structure based on project idea
   */
  generateTeamStructure: async (data: AiAnalysisRequest) => {
    return apiClient.post<TeamStructureResponse>(
      "/AiAnalysis/team/generate",
      data
    );
  },

  /**
   * POST /api/AiAnalysis/tech/analyze
   * Analyze and recommend tech stack based on project idea
   */
  analyzeTechStack: async (data: AiAnalysisRequest) => {
    return apiClient.post<TechStackResponse>(
      "/AiAnalysis/tech/analyze",
      data
    );
  },

  /**
   * POST /api/AiAnalysis/full
   * Get full analysis (team structure + tech stack) based on project idea
   */
  getFullAnalysis: async (data: AiAnalysisRequest) => {
    return apiClient.post<FullAnalysisResponse>(
      "/AiAnalysis/full",
      data
    );
  },
};

