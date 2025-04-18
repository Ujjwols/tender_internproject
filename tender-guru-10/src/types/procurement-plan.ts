
export type QuarterStatus = 'Planned' | 'In Progress' | 'Completed';

export interface QuarterlyTarget {
  id: number;
  procurement_plan_id: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  target_details: string;
  status: QuarterStatus;
  created_at: string;
}

export interface ProcurementPlan {
  id: number;
  policy_number: string;
  department: string;
  project_name: string;
  project_description: string;
  estimated_cost: number;
  proposed_budget: number;
  proposed_budget_percentage: number;
  created_at: string;
  committee_id?: number;
  quarterly_targets: QuarterlyTarget[];
}
