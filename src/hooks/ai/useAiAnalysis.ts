import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { aiAnalysisService } from "../../services/aiAnalysisService";
import { extractErrorMessage } from "../../lib/authApi";
import type {
  AiAnalysisRequest,
  TeamStructureResponse,
  TechStackResponse,
  FullAnalysisResponse,
} from "../../types/aiAnalysis";

/**
 * POST /api/AiAnalysis/team/generate
 * Generate team structure based on project idea
 */
export const useGenerateTeamStructure = () => {
  return useMutation<
    TeamStructureResponse,
    Error,
    AiAnalysisRequest
  >({
    mutationFn: (data) => aiAnalysisService.generateTeamStructure(data),
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to generate team structure");
    },
  });
};

/**
 * POST /api/AiAnalysis/tech/analyze
 * Analyze and recommend tech stack based on project idea
 */
export const useAnalyzeTechStack = () => {
  return useMutation<
    TechStackResponse,
    Error,
    AiAnalysisRequest
  >({
    mutationFn: (data) => aiAnalysisService.analyzeTechStack(data),
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to analyze tech stack");
    },
  });
};

/**
 * POST /api/AiAnalysis/full
 * Get full analysis (team structure + tech stack) based on project idea
 */
export const useFullAnalysis = () => {
  return useMutation<
    FullAnalysisResponse,
    Error,
    AiAnalysisRequest
  >({
    mutationFn: (data) => aiAnalysisService.getFullAnalysis(data),
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to get full analysis");
    },
  });
};

