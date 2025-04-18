
export type CommitteeTaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type CommitteeApprovalStatus = 'draft' | 'pending' | 'pending_review' | 'approved' | 'rejected';
export type DocumentStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface CommitteeTask {
  id: number;
  title: string;
  description: string;
  assignedTo: number; // memberId
  dueDate: string;
  status: CommitteeTaskStatus;
  attachments?: File[];
  comments?: string[];
}

export interface CommitteeMember {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: 'chairperson' | 'member' | 'secretary';
  department: string;
  tasks: CommitteeTask[];
}

export interface SpecificationReview {
  id: number;
  committeeId: number;
  scheduledDate: string;
  actualDate?: string;
  minutes?: string;
  status: DocumentStatus;
  reviewers: CommitteeMember[];
  documents: File[];
  comments: string[];
}

export interface Committee {
  _id: string;
  name: string;
  purpose: string;
  formationDate: string;
  specificationSubmissionDate?: string;
  reviewDate?: string;
  schedule?: string;
  members: CommitteeMember[];
  formationLetter?: {
    filename: string;
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
    employeeId: string;
  };
  approvalStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewHistory {
  id: number;
  reviewDate: string;
  reviewers: CommitteeMember[];
  status: DocumentStatus;
  minutes?: string;
  documents: File[];
  comments: string[];
  nextReviewDate?: string;
}
