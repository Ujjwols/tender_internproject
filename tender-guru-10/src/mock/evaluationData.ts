
import { EvaluationTeam, TechnicalCriteria, FinancialEvaluation } from "@/types/evaluation";

export const mockEvaluationTeam: EvaluationTeam = {
  id: 1,
  tenderId: 1,
  name: "Network Infrastructure Bid Evaluation Team",
  members: [
    {
      id: 1,
      name: "Robert Chen",
      email: "robert.c@company.com",
      role: "chair",
      department: "Technical",
      hasAccess: true,
    },
    {
      id: 2,
      name: "Lisa Anderson",
      email: "lisa.a@company.com",
      role: "member",
      department: "Finance",
      hasAccess: true,
    },
    {
      id: 3,
      name: "David Kumar",
      email: "david.k@company.com",
      role: "secretary",
      department: "Procurement",
      hasAccess: true,
    },
  ],
  createdAt: new Date().toISOString(),
  status: "active",
};

export const mockTechnicalCriteria: TechnicalCriteria[] = [
  {
    id: 1,
    name: "Technical Compliance",
    description: "Compliance with technical specifications",
    maxScore: 100,
    weight: 0.4,
  },
  {
    id: 2,
    name: "Experience & Track Record",
    description: "Past experience in similar projects",
    maxScore: 100,
    weight: 0.3,
  },
  {
    id: 3,
    name: "Implementation Methodology",
    description: "Proposed implementation approach",
    maxScore: 100,
    weight: 0.3,
  },
];

export const mockFinancialEvaluations: FinancialEvaluation[] = [
  {
    id: 1,
    vendorId: 1,
    bidAmount: 250000,
    technicalScore: 85,
    financialScore: 90,
    totalScore: 87,
    rank: 1,
    evaluatedBy: 1,
    timestamp: new Date().toISOString(),
    status: "evaluated",
  },
  {
    id: 2,
    vendorId: 2,
    bidAmount: 275000,
    technicalScore: 88,
    financialScore: 82,
    totalScore: 85.6,
    rank: 2,
    evaluatedBy: 1,
    timestamp: new Date().toISOString(),
    status: "evaluated",
  },
  {
    id: 3,
    vendorId: 3,
    bidAmount: 235000,
    technicalScore: 75,
    financialScore: 95,
    totalScore: 83,
    rank: 3,
    evaluatedBy: 1,
    timestamp: new Date().toISOString(),
    status: "evaluated",
  },
];
