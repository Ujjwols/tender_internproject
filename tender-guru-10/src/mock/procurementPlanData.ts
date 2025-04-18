import { ProcurementPlan } from "@/types/procurement-plan";

export const mockProcurementPlans: ProcurementPlan[] = [
  {
    id: 1,
    policy_number: "PP-2080-WL-N-01",
    department: "Wireline",
    project_name: "LTE Upgrade",
    project_description: "Network infrastructure upgrade for LTE services in central region",
    estimated_cost: 543280000,
    proposed_budget: 217312000,
    proposed_budget_percentage: 40,
    created_at: "2024-03-15T10:00:00Z",
    committee_id: 1, // Network Infrastructure Upgrade Committee
    quarterly_targets: [
      {
        id: 1,
        procurement_plan_id: 1,
        quarter: "Q1",
        target_details: "Initial planning and vendor selection",
        status: "Completed",
        created_at: "2024-03-15T10:00:00Z"
      },
      {
        id: 2,
        procurement_plan_id: 1,
        quarter: "Q2",
        target_details: "Equipment procurement and delivery",
        status: "In Progress",
        created_at: "2024-03-15T10:00:00Z"
      },
      {
        id: 3,
        procurement_plan_id: 1,
        quarter: "Q3",
        target_details: "Installation and testing",
        status: "Planned",
        created_at: "2024-03-15T10:00:00Z"
      },
      {
        id: 4,
        procurement_plan_id: 1,
        quarter: "Q4",
        target_details: "Network optimization and project closure",
        status: "Planned",
        created_at: "2024-03-15T10:00:00Z"
      }
    ]
  },
  {
    id: 2,
    policy_number: "PP-2080-WL-O-01",
    department: "Wireless",
    project_name: "2G Expansion",
    project_description: "2G network expansion in rural areas of western region",
    estimated_cost: 107900000,
    proposed_budget: 102505000,
    proposed_budget_percentage: 95,
    created_at: "2024-03-16T09:00:00Z",
    committee_id: 2, // Data Center Equipment Committee
    quarterly_targets: [
      {
        id: 5,
        procurement_plan_id: 2,
        quarter: "Q1",
        target_details: "Site survey and planning",
        status: "Completed",
        created_at: "2024-03-16T09:00:00Z"
      },
      {
        id: 6,
        procurement_plan_id: 2,
        quarter: "Q2",
        target_details: "Equipment procurement",
        status: "Completed",
        created_at: "2024-03-16T09:00:00Z"
      },
      {
        id: 7,
        procurement_plan_id: 2,
        quarter: "Q3",
        target_details: "Installation phase",
        status: "In Progress",
        created_at: "2024-03-16T09:00:00Z"
      },
      {
        id: 8,
        procurement_plan_id: 2,
        quarter: "Q4",
        target_details: "Testing and optimization",
        status: "Planned",
        created_at: "2024-03-16T09:00:00Z"
      }
    ]
  },
  {
    id: 3,
    policy_number: "PP-2080-WL-N-02",
    department: "Wireline",
    project_name: "Fiber Network Expansion",
    project_description: "Expanding fiber network coverage in metropolitan areas",
    estimated_cost: 892500000,
    proposed_budget: 850000000,
    proposed_budget_percentage: 95,
    created_at: "2024-03-17T10:00:00Z",
    quarterly_targets: [
      {
        id: 9,
        procurement_plan_id: 3,
        quarter: "Q1",
        target_details: "Planning and design phase",
        status: "Completed",
        created_at: "2024-03-17T10:00:00Z"
      },
      {
        id: 10,
        procurement_plan_id: 3,
        quarter: "Q2",
        target_details: "Infrastructure setup",
        status: "In Progress",
        created_at: "2024-03-17T10:00:00Z"
      },
      {
        id: 11,
        procurement_plan_id: 3,
        quarter: "Q3",
        target_details: "Network deployment",
        status: "Planned",
        created_at: "2024-03-17T10:00:00Z"
      },
      {
        id: 12,
        procurement_plan_id: 3,
        quarter: "Q4",
        target_details: "Testing and optimization",
        status: "Planned",
        created_at: "2024-03-17T10:00:00Z"
      }
    ]
  },
  {
    id: 4,
    policy_number: "PP-2080-WL-O-02",
    department: "Wireless",
    project_name: "5G Network Implementation",
    project_description: "Implementation of 5G network in key urban areas",
    estimated_cost: 1250000000,
    proposed_budget: 1200000000,
    proposed_budget_percentage: 96,
    created_at: "2024-03-18T09:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 13 + i,
      procurement_plan_id: 4,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "5G implementation phase " + (i + 1),
      status: i < 2 ? "Completed" : "Planned",
      created_at: "2024-03-18T09:00:00Z"
    }))
  },
  {
    id: 5,
    policy_number: "PP-2080-WL-N-03",
    department: "Wireline",
    project_name: "Data Center Upgrade",
    project_description: "Upgrading existing data center infrastructure",
    estimated_cost: 750000000,
    proposed_budget: 700000000,
    proposed_budget_percentage: 93,
    created_at: "2024-03-19T11:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 17 + i,
      procurement_plan_id: 5,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "Data center upgrade phase " + (i + 1),
      status: i < 1 ? "Completed" : "Planned",
      created_at: "2024-03-19T11:00:00Z"
    }))
  },
  {
    id: 6,
    policy_number: "PP-2080-WL-O-03",
    department: "Wireless",
    project_name: "Rural Connectivity",
    project_description: "Expanding wireless coverage in rural areas",
    estimated_cost: 450000000,
    proposed_budget: 425000000,
    proposed_budget_percentage: 94,
    created_at: "2024-03-20T10:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 21 + i,
      procurement_plan_id: 6,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "Rural connectivity phase " + (i + 1),
      status: "Planned",
      created_at: "2024-03-20T10:00:00Z"
    }))
  },
  {
    id: 7,
    policy_number: "PP-2080-WL-N-04",
    department: "Wireline",
    project_name: "Network Security Enhancement",
    project_description: "Implementing advanced security measures",
    estimated_cost: 350000000,
    proposed_budget: 340000000,
    proposed_budget_percentage: 97,
    created_at: "2024-03-21T09:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 25 + i,
      procurement_plan_id: 7,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "Security implementation phase " + (i + 1),
      status: i < 3 ? "Completed" : "In Progress",
      created_at: "2024-03-21T09:00:00Z"
    }))
  },
  {
    id: 8,
    policy_number: "PP-2080-WL-O-04",
    department: "Wireless",
    project_name: "IoT Infrastructure",
    project_description: "Setting up IoT network infrastructure",
    estimated_cost: 280000000,
    proposed_budget: 260000000,
    proposed_budget_percentage: 93,
    created_at: "2024-03-22T10:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 29 + i,
      procurement_plan_id: 8,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "IoT infrastructure phase " + (i + 1),
      status: i < 2 ? "Completed" : "In Progress",
      created_at: "2024-03-22T10:00:00Z"
    }))
  },
  {
    id: 9,
    policy_number: "PP-2080-WL-N-05",
    department: "Wireline",
    project_name: "Cloud Migration",
    project_description: "Migrating services to cloud infrastructure",
    estimated_cost: 420000000,
    proposed_budget: 400000000,
    proposed_budget_percentage: 95,
    created_at: "2024-03-23T11:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 33 + i,
      procurement_plan_id: 9,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "Cloud migration phase " + (i + 1),
      status: "In Progress",
      created_at: "2024-03-23T11:00:00Z"
    }))
  },
  {
    id: 10,
    policy_number: "PP-2080-WL-O-05",
    department: "Wireless",
    project_name: "Network Optimization",
    project_description: "Optimizing wireless network performance",
    estimated_cost: 180000000,
    proposed_budget: 170000000,
    proposed_budget_percentage: 94,
    created_at: "2024-03-24T10:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 37 + i,
      procurement_plan_id: 10,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "Network optimization phase " + (i + 1),
      status: i < 1 ? "Completed" : "Planned",
      created_at: "2024-03-24T10:00:00Z"
    }))
  },
  {
    id: 11,
    policy_number: "PP-2080-WL-N-06",
    department: "Wireline",
    project_name: "Legacy System Upgrade",
    project_description: "Upgrading legacy network systems",
    estimated_cost: 320000000,
    proposed_budget: 300000000,
    proposed_budget_percentage: 94,
    created_at: "2024-03-25T09:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 41 + i,
      procurement_plan_id: 11,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "System upgrade phase " + (i + 1),
      status: "Planned",
      created_at: "2024-03-25T09:00:00Z"
    }))
  },
  {
    id: 12,
    policy_number: "PP-2080-WL-O-06",
    department: "Wireless",
    project_name: "Smart City Infrastructure",
    project_description: "Implementing smart city network solutions",
    estimated_cost: 550000000,
    proposed_budget: 520000000,
    proposed_budget_percentage: 95,
    created_at: "2024-03-26T10:00:00Z",
    quarterly_targets: Array(4).fill(null).map((_, i) => ({
      id: 45 + i,
      procurement_plan_id: 12,
      quarter: `Q${i + 1}` as "Q1" | "Q2" | "Q3" | "Q4",
      target_details: "Smart city implementation phase " + (i + 1),
      status: i < 1 ? "In Progress" : "Planned",
      created_at: "2024-03-26T10:00:00Z"
    }))
  }
];
