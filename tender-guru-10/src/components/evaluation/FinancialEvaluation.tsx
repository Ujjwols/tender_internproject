
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BidAmountField from "../vendor/form/BidAmountField";
import type { FinancialEvaluation as FinancialEvaluationType } from "@/types/evaluation";

interface Props {
  teamId: number;
  evaluations: FinancialEvaluationType[];
}

const FinancialEvaluation = ({ teamId, evaluations: initialEvaluations }: Props) => {
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<FinancialEvaluationType[]>(initialEvaluations);
  const [newEvaluation, setNewEvaluation] = useState({
    vendorId: "",
    bidAmount: "",
    technicalScore: "",
  });

  const calculateFinancialScore = (bidAmount: number, lowestBid: number) => {
    // Financial score = (Lowest Bid / Bid Amount) × 100
    return (lowestBid / bidAmount) * 100;
  };

  const calculateTotalScore = (technicalScore: number, financialScore: number) => {
    // Assuming 70% weight for technical and 30% for financial
    return (technicalScore * 0.7) + (financialScore * 0.3);
  };

  const handleAddEvaluation = () => {
    if (!newEvaluation.vendorId || !newEvaluation.bidAmount || !newEvaluation.technicalScore) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const bidAmount = parseFloat(newEvaluation.bidAmount);
    const technicalScore = parseFloat(newEvaluation.technicalScore);
    const lowestBid = Math.min(...evaluations.map(evaluation => evaluation.bidAmount), bidAmount);
    const financialScore = calculateFinancialScore(bidAmount, lowestBid);
    const totalScore = calculateTotalScore(technicalScore, financialScore);

    const newEval: FinancialEvaluationType = {
      id: Date.now(),
      vendorId: parseInt(newEvaluation.vendorId),
      bidAmount,
      technicalScore,
      financialScore,
      totalScore,
      rank: 0, // Will be calculated after adding
      evaluatedBy: teamId,
      timestamp: new Date().toISOString(),
      status: "evaluated",
    };

    // Update all evaluations with new ranks
    const updatedEvaluations = [...evaluations, newEval]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((evaluation, index) => ({ ...evaluation, rank: index + 1 }));

    setEvaluations(updatedEvaluations);
    setNewEvaluation({ vendorId: "", bidAmount: "", technicalScore: "" });

    toast({
      title: "Evaluation Added",
      description: `Financial evaluation for Vendor ${newEvaluation.vendorId} has been recorded`,
    });
  };

  const handleStatusChange = (evaluation: FinancialEvaluationType, newStatus: "approved" | "rejected") => {
    const updatedEvaluations = evaluations.map(item => 
      item.id === evaluation.id ? { ...item, status: newStatus } : item
    );
    setEvaluations(updatedEvaluations);

    toast({
      title: `Evaluation ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      description: `Financial evaluation for Vendor ${evaluation.vendorId} has been ${newStatus}`,
    });
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Vendor ID,Bid Amount,Technical Score,Financial Score,Total Score,Rank,Status\n" +
      evaluations.map(evaluation => 
        `${evaluation.vendorId},${evaluation.bidAmount},${evaluation.technicalScore},${evaluation.financialScore},${evaluation.totalScore},${evaluation.rank},${evaluation.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Financial Evaluation</h3>
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Evaluation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Financial Evaluation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorId">Vendor ID</Label>
                    <Input
                      id="vendorId"
                      type="number"
                      value={newEvaluation.vendorId}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, vendorId: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <BidAmountField
                      bidAmount={newEvaluation.bidAmount}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, bidAmount: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technicalScore">Technical Score</Label>
                    <Input
                      id="technicalScore"
                      type="number"
                      min="0"
                      max="100"
                      value={newEvaluation.technicalScore}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, technicalScore: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddEvaluation} className="w-full">
                    Add Evaluation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={exportToCSV}>Export Results</Button>
          </div>
        </div>

        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Technical Score</TableHead>
                <TableHead>Financial Score</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.vendorId}</TableCell>
                  <TableCell>${evaluation.bidAmount.toLocaleString()}</TableCell>
                  <TableCell>{evaluation.technicalScore.toFixed(2)}</TableCell>
                  <TableCell>{evaluation.financialScore.toFixed(2)}</TableCell>
                  <TableCell>{evaluation.totalScore.toFixed(2)}</TableCell>
                  <TableCell>{evaluation.rank}</TableCell>
                  <TableCell>
                    <Badge variant={evaluation.status === "evaluated" ? "secondary" : "outline"}>
                      {evaluation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(evaluation, "approved")}
                        disabled={evaluation.status === "approved"}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleStatusChange(evaluation, "rejected")}
                        disabled={evaluation.status === "rejected"}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default FinancialEvaluation;
