
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { TechnicalCriteria, TechnicalScore } from "@/types/evaluation";

interface Props {
  vendorId: number;
  criteria: TechnicalCriteria[];
  onScoreSubmit: (scores: TechnicalScore[]) => void;
}

const TechnicalEvaluationForm = ({ vendorId, criteria, onScoreSubmit }: Props) => {
  const { toast } = useToast();
  const [scores, setScores] = useState<TechnicalScore[]>([]);

  const handleScoreChange = (criteriaId: number, score: number) => {
    const maxScore = criteria.find(c => c.id === criteriaId)?.maxScore || 100;
    const validScore = Math.min(Math.max(0, score), maxScore);
    
    setScores(prev => {
      const existingIndex = prev.findIndex(s => s.criteriaId === criteriaId);
      if (existingIndex >= 0) {
        const newScores = [...prev];
        newScores[existingIndex] = {
          ...newScores[existingIndex],
          score: validScore
        };
        return newScores;
      }
      return [...prev, {
        id: Date.now(),
        criteriaId,
        evaluatorId: 1, // This would come from auth context
        vendorId,
        score: validScore,
        comments: "",
        timestamp: new Date().toISOString()
      }];
    });
  };

  const handleCommentsChange = (criteriaId: number, comments: string) => {
    setScores(prev => {
      const existingIndex = prev.findIndex(s => s.criteriaId === criteriaId);
      if (existingIndex >= 0) {
        const newScores = [...prev];
        newScores[existingIndex] = {
          ...newScores[existingIndex],
          comments
        };
        return newScores;
      }
      return [...prev, {
        id: Date.now(),
        criteriaId,
        evaluatorId: 1, // This would come from auth context
        vendorId,
        score: 0,
        comments,
        timestamp: new Date().toISOString()
      }];
    });
  };

  const handleSubmit = () => {
    // Validate that all criteria have been scored
    const missingScores = criteria.filter(c => 
      !scores.find(s => s.criteriaId === c.id)
    );

    if (missingScores.length > 0) {
      toast({
        title: "Missing Scores",
        description: "Please provide scores for all criteria before submitting.",
        variant: "destructive",
      });
      return;
    }

    onScoreSubmit(scores);
    toast({
      title: "Evaluation Submitted",
      description: "Technical evaluation scores have been recorded.",
    });
  };

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="space-y-6 p-4">
        {criteria.map((criterion) => (
          <Card key={criterion.id} className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{criterion.name}</h4>
                <p className="text-sm text-gray-500">{criterion.description}</p>
                <p className="text-sm text-gray-500">Weight: {criterion.weight * 100}%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`score-${criterion.id}`}>
                  Score (Max: {criterion.maxScore})
                </Label>
                <Input
                  id={`score-${criterion.id}`}
                  type="number"
                  min={0}
                  max={criterion.maxScore}
                  value={scores.find(s => s.criteriaId === criterion.id)?.score || ""}
                  onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                  className="max-w-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`comments-${criterion.id}`}>Comments</Label>
                <Textarea
                  id={`comments-${criterion.id}`}
                  value={scores.find(s => s.criteriaId === criterion.id)?.comments || ""}
                  onChange={(e) => handleCommentsChange(criterion.id, e.target.value)}
                  placeholder="Add evaluation comments..."
                />
              </div>
            </div>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Submit Evaluation</Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TechnicalEvaluationForm;
