
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import TechnicalEvaluationForm from "./TechnicalEvaluationForm";
import type { TechnicalCriteria, TechnicalScore } from "@/types/evaluation";

interface Props {
  teamId: number;
  criteria: TechnicalCriteria[];
}

const TechnicalEvaluation = ({ teamId, criteria }: Props) => {
  const { toast } = useToast();
  const [scores, setScores] = useState<TechnicalScore[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  // Mock vendors - In a real app, this would come from your data source
  const mockVendors = [
    { id: 1, name: "Vendor A" },
    { id: 2, name: "Vendor B" },
    { id: 3, name: "Vendor C" },
  ];

  const handleScoreSubmit = (newScores: TechnicalScore[]) => {
    setScores(prev => [...prev, ...newScores]);
    setSelectedVendorId(null);
  };

  const calculateTotalScore = (vendorId: number) => {
    return scores
      .filter(score => score.vendorId === vendorId)
      .reduce((total, score) => {
        const criterion = criteria.find(c => c.id === score.criteriaId);
        return total + (score.score * (criterion?.weight || 1));
      }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Technical Evaluation</h3>
        <Button variant="outline" onClick={() => {
          const csvContent = "data:text/csv;charset=utf-8," + 
            "Vendor,Total Score\n" +
            mockVendors.map(vendor => 
              `${vendor.name},${calculateTotalScore(vendor.id)}`
            ).join("\n");
          const encodedUri = encodeURI(csvContent);
          window.open(encodedUri);
        }}>
          Export Scores
        </Button>
      </div>

      {selectedVendorId ? (
        <TechnicalEvaluationForm
          vendorId={selectedVendorId}
          criteria={criteria}
          onScoreSubmit={handleScoreSubmit}
        />
      ) : (
        <Card>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  {criteria.map((criterion) => (
                    <TableHead key={criterion.id}>{criterion.name}</TableHead>
                  ))}
                  <TableHead>Total Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.name}</TableCell>
                    {criteria.map((criterion) => {
                      const score = scores.find(
                        s => s.vendorId === vendor.id && s.criteriaId === criterion.id
                      );
                      return (
                        <TableCell key={criterion.id}>
                          {score?.score || "-"}
                        </TableCell>
                      );
                    })}
                    <TableCell>{calculateTotalScore(vendor.id).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVendorId(vendor.id)}
                      >
                        Evaluate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default TechnicalEvaluation;
