
import { CommitteeFormationLetter } from "@/types/letter";

export const mockLetters: CommitteeFormationLetter[] = [
  {
    id: 1,
    referenceNumber: "NTC/2024/CF/001",
    issueDate: "2024-03-15",
    department: "Technical",
    purpose: "Network Infrastructure Committee Formation",
    fileUrl: "/documents/committee-letter-1.pdf",
    fileName: "committee-letter-1.pdf",
    version: 1,
    status: "distributed",
    distributions: [
      {
        memberId: 1,
        sentDate: "2024-03-15",
        acknowledgmentDate: "2024-03-15"
      },
      {
        memberId: 2,
        sentDate: "2024-03-15",
        acknowledgmentDate: "2024-03-16"
      }
    ],
    metadata: {
      createdBy: "John Smith",
      createdAt: "2024-03-15T10:00:00Z",
      lastModified: "2024-03-15T10:00:00Z"
    }
  },
  {
    id: 2,
    referenceNumber: "NTC/2024/CF/002",
    issueDate: "2024-03-16",
    department: "Procurement",
    purpose: "Data Center Equipment Committee Formation",
    fileUrl: "/documents/committee-letter-2.pdf",
    fileName: "committee-letter-2.pdf",
    version: 1,
    status: "issued",
    distributions: [],
    metadata: {
      createdBy: "Sarah Johnson",
      createdAt: "2024-03-16T09:00:00Z",
      lastModified: "2024-03-16T09:00:00Z"
    }
  }
];
