import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { useFullAnalysis } from "@/hooks/ai/useAiAnalysis";
import type { FullAnalysisResponse } from "@/types/aiAnalysis";
import { TeamStructureCard } from "@/components/ai/TeamStructureCard";
import { TechStackSection } from "@/components/ai/TechStackSection";

export default function AIAnalysisPage() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [analysisResult, setAnalysisResult] =
    useState<FullAnalysisResponse | null>(null);

  const fullAnalysis = useFullAnalysis();

  const handleAnalyze = () => {
    if (!idea.trim()) {
      return;
    }

    fullAnalysis.mutate(
      { idea: idea.trim() },
      {
        onSuccess: (data) => {
          setAnalysisResult(data);
        },
      }
    );
  };

  const handleCreateProject = () => {
    // Navigate to projects page and open create dialog
    // We'll pass the analysis data via state or localStorage
    if (analysisResult) {
      localStorage.setItem(
        "aiAnalysisResult",
        JSON.stringify(analysisResult)
      );
      navigate("/projects?create=true");
    }
  };

  const handleAnalyzeAnother = () => {
    setIdea("");
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI Project Analyzer
            </h1>
            <p className="text-muted-foreground mt-1">
              Get AI-powered recommendations for team structure and tech stack
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      {!analysisResult && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Describe Your Project Idea</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Enter a brief description of your project idea, and our AI will
              analyze it to recommend the ideal team structure and technology
              stack.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., I want to build a desktop app like Amazon"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleAnalyze();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter (Cmd+Enter on Mac) to analyze
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={!idea.trim() || fullAnalysis.isPending}
                className="gap-2"
              >
                {fullAnalysis.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Project
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {fullAnalysis.isPending && (
        <Card className="mb-8">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-semibold">Analyzing your project idea...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This may take a few seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analysisResult.total_roles}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Team Roles
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {analysisResult.total_members}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended Members
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {analysisResult.processing_time.toFixed(2)}s
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Processing Time
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Structure */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Team Structure</h2>
              <Badge variant="outline" className="text-sm">
                {analysisResult.team_structure.roles.length} Roles
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisResult.team_structure.roles.map((role, index) => (
                <TeamStructureCard key={index} role={role} />
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <TechStackSection techStack={analysisResult.tech_stack} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleCreateProject}
              size="lg"
              className="flex-1 gap-2"
            >
              Create Project with These Suggestions
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleAnalyzeAnother}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Idea
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

