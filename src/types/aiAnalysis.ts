// AI Analysis Types

export interface AiAnalysisRequest {
  idea: string;
}

export interface TeamRole {
  role: string;
  track: string;
  recommended_members: number;
  skills: string[];
  priority: "High" | "Medium" | "Low";
}

export interface TeamStructureResponse {
  roles: TeamRole[];
}

export interface TechStackResponse {
  backend: string[];
  frontend: string[];
  database: string[];
  ai_stack: string[];
  devops: string[];
}

export interface FullAnalysisResponse {
  success: boolean;
  team_structure: {
    roles: TeamRole[];
  };
  tech_stack: {
    backend: string[];
    frontend: string[];
    database: string[];
    ai_stack: string[];
    devops: string[];
  };
  total_roles: number;
  total_members: number;
  processing_time: number;
}

