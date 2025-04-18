
import type { SpecificationDocument, ReviewSession, DocumentVersion } from "@/types/specification";
import type { CommitteeMember } from "@/types/committee";

const mockMembers: CommitteeMember[] = [
  {
    id: 1,
    name: "John Smith",
    employeeId: "EMP001",
    role: "chairperson",
    department: "Engineering",
    email: "john.smith@example.com",
    phone: "+1-555-0101",
    tasks: [],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    employeeId: "EMP002",
    role: "member",
    department: "Quality Assurance",
    email: "sarah.j@example.com",
    phone: "+1-555-0102",
    tasks: [],
  },
];

const mockVersionHistory: DocumentVersion[] = [
  {
    id: 1,
    version: 1,
    documentUrl: "/docs/network-spec-v1.pdf",
    changes: "Initial specification document",
    submittedBy: 1,
    submittedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    version: 2,
    documentUrl: "/docs/network-spec-v2.pdf",
    changes: "Updated bandwidth requirements",
    submittedBy: 2,
    submittedAt: "2024-03-16T14:30:00Z",
  },
];

export const mockSpecifications: SpecificationDocument[] = [
  {
    id: 1,
    title: "Network Infrastructure Upgrade Specification",
    description: "Detailed specifications for upgrading the corporate network infrastructure",
    version: 2,
    status: "under_review",
    submittedBy: 1,
    submittedAt: "2024-03-15T10:00:00Z",
    lastModified: "2024-03-16T14:30:00Z",
    documentUrl: "/docs/network-spec-v2.pdf",
    committeeId: 1,
    comments: [
      "Please review section 3.2 regarding bandwidth requirements",
      "Cost estimates need to be updated in section 5",
    ],
    versionHistory: mockVersionHistory,
  },
];

export const mockReviews: ReviewSession[] = [
  {
    id: 1,
    specificationId: 1,
    scheduledDate: "2024-03-20T14:00:00Z",
    status: "scheduled",
    reviewers: mockMembers,
    minutes: "",
    comments: [],
    documents: [],
  },
];

export const getSpecificationById = (id: number): SpecificationDocument | undefined => {
  return mockSpecifications.find((spec) => spec.id === id);
};

export const getVersionHistory = (specId: number): DocumentVersion[] | undefined => {
  const spec = getSpecificationById(specId);
  return spec?.versionHistory;
};

export const getReviewBySpecificationId = (specId: number): ReviewSession | undefined => {
  return mockReviews.find((review) => review.specificationId === specId);
};
