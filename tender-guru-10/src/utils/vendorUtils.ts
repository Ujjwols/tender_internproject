
import { Vendor, VendorQualification, VendorBid } from "@/types/vendor";

export const defaultQualificationCriteria: VendorQualification[] = [
  {
    id: 1,
    criteria: "Financial Capacity",
    minimumRequirement: "Annual turnover > $1M",
    weight: 30,
  },
  {
    id: 2,
    criteria: "Technical Capability",
    minimumRequirement: "Min. 3 similar projects",
    weight: 40,
  },
  {
    id: 3,
    criteria: "Experience",
    minimumRequirement: "5+ years in industry",
    weight: 20,
  },
  {
    id: 4,
    criteria: "Certifications",
    minimumRequirement: "ISO 9001",
    weight: 10,
  },
];

// Mock vendors data
export const mockVendors: Vendor[] = [
  {
    id: 1,
    companyName: "Tech Solutions Inc.",
    registrationNumber: "TSI123456",
    email: "contact@techsolutions.com",
    phone: "+1-555-0123",
    address: "123 Tech Avenue, Silicon Valley, CA",
    category: ["IT", "Software"],
    documents: [],
    status: "approved",
    qualificationScore: 85,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: 2,
    companyName: "Global Networks Ltd",
    registrationNumber: "GNL789012",
    email: "info@globalnetworks.com",
    phone: "+1-555-0124",
    address: "456 Network Street, Boston, MA",
    category: ["Networking", "Hardware"],
    documents: [],
    status: "pending",
    qualificationScore: 72,
    createdAt: "2024-02-01T10:30:00Z",
  },
  {
    id: 3,
    companyName: "Security Systems Pro",
    registrationNumber: "SSP345678",
    email: "contact@securitypro.com",
    phone: "+1-555-0125",
    address: "789 Security Road, Austin, TX",
    category: ["Security", "Hardware"],
    documents: [],
    status: "rejected",
    qualificationScore: 45,
    createdAt: "2024-02-15T14:15:00Z",
  },
];

// Mock bids data
export const mockBids: VendorBid[] = [
  {
    id: 1,
    tenderId: 1,
    vendorId: 1,
    bidAmount: 150000,
    technicalScore: 88,
    documents: [],
    submissionDate: "2024-03-01T09:00:00Z",
    status: "submitted",
  },
  {
    id: 2,
    tenderId: 1,
    vendorId: 2,
    bidAmount: 165000,
    technicalScore: 92,
    documents: [],
    submissionDate: "2024-03-02T11:30:00Z",
    status: "under_review",
  },
  {
    id: 3,
    tenderId: 2,
    vendorId: 1,
    bidAmount: 75000,
    technicalScore: 85,
    documents: [],
    submissionDate: "2024-03-05T15:45:00Z",
    status: "accepted",
  },
];

export const calculateQualificationScore = (
  vendor: Vendor,
  criteria: VendorQualification[]
): number => {
  // This is a placeholder implementation
  // In a real application, this would evaluate vendor attributes against criteria
  return Math.floor(Math.random() * 100);
};

export const isVendorQualified = (score: number): boolean => {
  const QUALIFICATION_THRESHOLD = 70;
  return score >= QUALIFICATION_THRESHOLD;
};
