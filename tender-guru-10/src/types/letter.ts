
export type LetterStatus = 'draft' | 'issued' | 'distributed';

export interface LetterDistribution {
  memberId: number;
  sentDate: string;
  acknowledgmentDate?: string;
}

export interface CommitteeFormationLetter {
  id: number;
  referenceNumber: string;
  issueDate: string;
  department: string;
  purpose: string;
  fileUrl: string;
  fileName: string;
  version: number;
  status: LetterStatus;
  distributions: LetterDistribution[];
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModified: string;
  };
}

export type Letter = CommitteeFormationLetter;
