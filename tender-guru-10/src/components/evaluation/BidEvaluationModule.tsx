import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EvaluationTeamManagement from "./EvaluationTeamManagement";
import SecureDocumentViewer from "./SecureDocumentViewer";
import TechnicalEvaluation from "./TechnicalEvaluation";
import FinancialEvaluation from "./FinancialEvaluation";
import type { EvaluationTeam, TechnicalCriteria, FinancialEvaluation as FinancialEvaluationType } from "@/types/evaluation";

// Mock data
const mockTeam: EvaluationTeam = {
  id: 1,
  tenderId: 1,
  name: "Technical Evaluation Committee",
  members: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "chair",
      department: "IT",
      hasAccess: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "member",
      department: "Finance",
      hasAccess: true,
    },
  ],
  createdAt: new Date().toISOString(),
  status: "active",
};

const mockCriteria: TechnicalCriteria[] = [
  {
    id: 1,
    name: "Technical Capability",
    description: "Assessment of technical expertise and resources",
    maxScore: 100,
    weight: 0.4,
  },
  {
    id: 2,
    name: "Past Experience",
    description: "Evaluation of similar projects completed",
    maxScore: 100,
    weight: 0.3,
  },
  {
    id: 3,
    name: "Methodology",
    description: "Proposed approach and implementation plan",
    maxScore: 100,
    weight: 0.3,
  },
];

const mockFinancialEvaluations: FinancialEvaluationType[] = [
  {
    id: 1,
    vendorId: 1,
    bidAmount: 150000,
    technicalScore: 85,
    financialScore: 90,
    totalScore: 87,
    rank: 1,
    evaluatedBy: 1,
    timestamp: new Date().toISOString(),
    status: "evaluated",
  },
];

const BidEvaluationModule = () => {
  const [activeTeam, setActiveTeam] = useState<EvaluationTeam>(mockTeam);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Bid Evaluation</h2>
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Evaluation Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="technical">Technical Evaluation</TabsTrigger>
          <TabsTrigger value="financial">Financial Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <EvaluationTeamManagement team={activeTeam} onTeamUpdate={setActiveTeam} />
        </TabsContent>

        <TabsContent value="documents">
          <SecureDocumentViewer teamId={activeTeam.id} />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalEvaluation 
            teamId={activeTeam.id} 
            criteria={mockCriteria} 
          />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialEvaluation 
            teamId={activeTeam.id}
            evaluations={mockFinancialEvaluations}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BidEvaluationModule;
