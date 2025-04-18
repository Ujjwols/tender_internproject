
import { User, UserRole, ModulePermission } from "@/types/auth";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Admin",
    email: "admin@ntc.net.np",
    role: "admin",
    employeeId: "NTC001",
    department: "Administration",
    phoneNumber: "+977-1234567890",
    designation: "Chief Administrative Officer",
    isActive: true,
    otpEnabled: true,
    permissions: [
      "manage_users",
      "manage_tenders",
      "manage_committees",
      "view_reports",
      "manage_notifications",
      "manage_partners",
      "view_sensitive_data"
    ]
  },
  {
    id: 2,
    name: "Sarah Procurement",
    email: "procurement@ntc.net.np",
    role: "procurement_officer",
    employeeId: "NTC002",
    department: "Procurement",
    phoneNumber: "+977-1234567891",
    designation: "Senior Procurement Officer",
    isActive: true,
    permissions: [
      "create_tender",
      "manage_bids",
      "view_submissions",
      "upload_documents",
      "manage_notifications"
    ]
  },
  {
    id: 3,
    name: "Mike Committee",
    email: "committee@ntc.net.np",
    role: "committee_member",
    employeeId: "NTC003",
    department: "Technical",
    phoneNumber: "+977-1234567892",
    designation: "Technical Committee Head",
    isActive: true,
    permissions: [
      "view_specifications",
      "submit_reviews",
      "attend_meetings",
      "upload_documents"
    ]
  },
  {
    id: 4,
    name: "Alice Evaluator",
    email: "evaluator@ntc.net.np",
    role: "evaluator",
    employeeId: "NTC004",
    department: "Technical Evaluation",
    phoneNumber: "+977-1234567893",
    designation: "Senior Technical Evaluator",
    isActive: true,
    otpEnabled: true,
    permissions: [
      "evaluate_bids",
      "view_documents",
      "submit_reviews",
      "view_sensitive_data"
    ]
  }
];

export const rolePermissions: Record<UserRole, ModulePermission[]> = {
  admin: [
    "manage_users",
    "manage_tenders", 
    "manage_committees",
    "view_reports",
    "manage_notifications",
    "manage_partners",
    "view_sensitive_data"
  ],
  procurement_officer: [
    "create_tender",
    "manage_bids",
    "view_submissions",
    "upload_documents",
    "manage_notifications"
  ],
  committee_member: [
    "view_specifications",
    "submit_reviews",
    "attend_meetings",
    "upload_documents"
  ],
  evaluator: [
    "evaluate_bids",
    "view_documents",
    "submit_reviews",
    "view_sensitive_data"
  ],
  bidder: [
    "view_submissions",
    "upload_documents"
  ],
  complaint_manager: [
    "manage_complaints",
    "view_documents",
    "upload_documents"
  ],
  project_manager: [
    "manage_projects",
    "view_reports",
    "upload_documents"
    
  ]
};

export const moduleAccessControl = [
  {
    module: "tenders",
    permissions: ["manage_tenders", "create_tender", "view_submissions"],
    restrictedTo: ["admin", "procurement_officer"]
  },
  {
    module: "committees",
    permissions: ["manage_committees", "submit_reviews", "attend_meetings"],
    restrictedTo: ["admin", "committee_member"]
  },
  {
    module: "evaluation",
    permissions: ["evaluate_bids", "view_documents", "view_sensitive_data"],
    restrictedTo: ["admin", "evaluator"]
  },
  {
    module: "complaints",
    permissions: ["manage_complaints", "view_documents"],
    restrictedTo: ["admin", "complaint_manager"]
  }
];

