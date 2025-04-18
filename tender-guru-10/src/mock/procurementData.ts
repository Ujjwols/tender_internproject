
import { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";

export const mockBidSecurities: BidSecurity[] = [
  {
    id: 1,
    tenderId: 1,
    amount: 25000,
    type: 'bank_guarantee',
    validUntil: "2024-07-15",
    status: 'active',
    documentRef: 'GB/BS/2024/001'
  },
  {
    id: 2,
    tenderId: 1,
    amount: 25000,
    type: 'bank_guarantee',
    validUntil: "2024-07-15",
    status: 'active',
    documentRef: 'CB/BS/2024/023'
  },
];

export const mockDocumentFees: DocumentFee[] = [
  {
    id: 1,
    tenderId: 1,
    amount: 5000,
    paymentStatus: 'paid',
    paymentDate: "2024-03-16",
    paymentRef: "RF/2024/001",
    receiptNumber: "RF/2024/001"
  },
  {
    id: 2,
    tenderId: 1,
    amount: 5000,
    paymentStatus: 'paid',
    paymentDate: "2024-03-17",
    paymentRef: "RF/2024/002",
    receiptNumber: "RF/2024/002"
  },
];

export const mockPreBidMeetings: PreBidMeeting[] = [
  {
    id: 1,
    tenderId: 1,
    scheduledDate: "2024-03-25T10:00:00Z",
    venue: "Conference Room A",
    attendees: [
      { 
        id: 1, 
        name: "Vendor A Representative", 
        organization: "Tech Solutions Ltd.",
        email: "vendor.a@techsolutions.com"
      },
      { 
        id: 2, 
        name: "Vendor B Representative", 
        organization: "Network Systems Inc.",
        email: "vendor.b@networksystems.com"
      },
    ],
    minutes: "Discussion points:\n1. Technical requirements clarification\n2. Timeline discussions\n3. Implementation approach",
    status: "completed"
  },
  {
    id: 2,
    tenderId: 2,
    scheduledDate: "2024-04-10T14:00:00Z",
    venue: "Virtual Meeting",
    attendees: [],
    status: "scheduled"
  },
];

export const mockClarifications: Clarification[] = [
  {
    id: 1,
    tenderId: 1,
    question: "Can you provide more details about the network topology requirements?",
    requestDate: "2024-03-26",
    responseDate: "2024-03-28",
    answer: "Detailed network topology requirements have been added to the technical specifications document.",
    status: "answered",
    requestedBy: {
      id: 1,
      name: "John Smith",
      organization: "Tech Solutions Ltd."
    }
  },
  {
    id: 2,
    tenderId: 1,
    question: "What are the warranty requirements for the equipment?",
    requestDate: "2024-03-27",
    status: "pending",
    requestedBy: {
      id: 2,
      name: "Jane Doe",
      organization: "Network Systems Inc."
    }
  },
];
