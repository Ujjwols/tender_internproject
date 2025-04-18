
import type { CommitteeMember } from "./committee";
import type { Letter } from "./letter";

export type SpecificationStatus = 
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_required"
  | "approved"
  | "rejected";

export type ReviewStatus = 
  | "scheduled"
  | "in_progress"
  | "completed"
  | "rescheduled";

export type NotificationType = "email" | "sms" | "both";

export interface DocumentVersion {
  id: number;
  version: number;
  documentUrl: string;
  changes: string;
  submittedBy: number;
  submittedAt: string;
}

export interface TaskAssignment {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  attachments: string[];
  notificationType: NotificationType;
}

export interface ReviewTracking {
  id: number;
  documentVersion: number;
  reviewDate: string;
  status: ReviewStatus;
  comments: string[];
  nextReviewDate?: string;
  notifiedMembers: {
    memberId: number;
    notified: boolean;
    notificationMethod: NotificationType;
    acknowledgedAt?: string;
  }[];
}

export interface SpecificationDocument {
  id: number;
  title: string;
  description: string;
  version: number;
  status: SpecificationStatus;
  submittedBy: number;
  submittedAt: string;
  lastModified: string;
  documentUrl: string;
  committeeId: number;
  comments: string[];
  versionHistory?: DocumentVersion[];
  committeeFormationLetter?: Letter;
  tasks?: TaskAssignment[];
  reviewTracking?: ReviewTracking[];
}

export interface ReviewSession {
  id: number;
  specificationId: number;
  scheduledDate: string;
  actualDate?: string;
  status: ReviewStatus;
  reviewers: CommitteeMember[];
  minutes?: string;
  comments: string[];
  nextReviewDate?: string;
  documents: {
    id: number;
    name: string;
    url: string;
    uploadedAt: string;
    type: "review_minutes" | "supporting_document" | "final_approval";
  }[];
}
