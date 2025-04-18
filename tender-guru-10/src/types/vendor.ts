
export type VendorStatus = "pending" | "approved" | "rejected";

export interface VendorQualification {
  id: number;
  criteria: string;
  minimumRequirement: string;
  weight: number;
}

export interface VendorBid {
  id: number;
  tenderId: number;
  vendorId: number;
  bidAmount: number;
  technicalScore: number;
  documents: File[];
  submissionDate: string;
  status: "submitted" | "under_review" | "accepted" | "rejected";
}

export interface VendorPerformance {
  id: number;
  vendorId: number;
  projectId: number;
  deliveryScore: number;
  qualityScore: number;
  communicationScore: number;
  timelinessScore: number;
  comments: string;
  evaluatedAt: string;
}

export interface Vendor {
  id: number;
  companyName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  category: string[];
  documents: File[];
  status: VendorStatus;
  qualificationScore: number;
  createdAt: string;
  performance?: VendorPerformance[];
}

