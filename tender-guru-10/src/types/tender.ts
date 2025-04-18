
export type TenderStatus = "draft" | "published" | "closed";

export type TenderApprovalStatus = "pending" | "approved" | "rejected";

export interface TenderComment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  timestamp: string; // Added this field to match the Comment type
}

export interface Tender {
  id: number;
  ifbNumber: string;
  title: string;
  description: string;
  publishDate: string;
  openingDate: string;
  bidValidity: string;
  status: TenderStatus;
  approvalStatus: TenderApprovalStatus;
  comments: TenderComment[];
  documents: File[];
}
