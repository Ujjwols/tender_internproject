
export type EvaluationTeamRole = "chair" | "member" | "secretary";

export interface EvaluationTeamMember {
  id: number;
  name: string;
  email: string;
  role: EvaluationTeamRole;
  department: string;
  otp?: string;
  otpValidUntil?: string;
  hasAccess: boolean;
}

export interface TechnicalCriteria {
  id: number;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface TechnicalScore {
  id: number;
  criteriaId: number;
  evaluatorId: number;
  vendorId: number;
  score: number;
  comments: string;
  timestamp: string;
}

export interface FinancialEvaluation {
  id: number;
  vendorId: number;
  bidAmount: number;
  technicalScore: number;
  financialScore: number;
  totalScore: number;
  rank: number;
  evaluatedBy: number;
  timestamp: string;
  status: "pending" | "evaluated" | "approved" | "rejected";
}

export interface EvaluationTeam {
  id: number;
  tenderId: number;
  name: string;
  members: EvaluationTeamMember[];
  createdAt: string;
  status: "active" | "inactive";
}

// Add the SecureDocument interface
export interface SecureDocument {
  id: number;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  isConfidential: boolean;
  accessHistory: {
    timestamp: string;
    action: string;
  }[];
}
