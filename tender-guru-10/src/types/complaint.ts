
export type ComplaintStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high';

export interface ComplaintDocument {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  fileSize: number;
}

export interface ComplaintResponse {
  id: number;
  complaintId: number;
  response: string;
  respondedBy: string;
  respondedAt: string;
  attachments?: ComplaintDocument[];
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  submittedBy: string;
  agencyId: number;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedAt: string;
  documents: ComplaintDocument[];
  responses: ComplaintResponse[];
  category: string;
  emailNotifications: boolean;
}
