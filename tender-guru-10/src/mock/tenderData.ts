
import { Tender } from "@/types/tender";

export const mockTenders: Tender[] = [
  {
    id: 1,
    ifbNumber: "NTC/G/ICB-01/2024",
    title: "Network Infrastructure Upgrade",
    description: "Procurement of network equipment and related services for infrastructure upgrade",
    publishDate: "2024-03-15",
    openingDate: "2024-04-15",
    bidValidity: "90",
    status: "published",
    approvalStatus: "approved",
    comments: [
      {
        id: 1,
        text: "Technical specifications approved",
        author: "Technical Committee",
        createdAt: "2024-03-10T10:00:00Z",
        timestamp: "2024-03-10T10:00:00Z",
      },
      {
        id: 2,
        text: "Budget allocation confirmed",
        author: "Finance Department",
        createdAt: "2024-03-12T14:30:00Z",
        timestamp: "2024-03-12T14:30:00Z",
      },
    ],
    documents: [],
  },
  {
    id: 2,
    ifbNumber: "NTC/G/ICB-02/2024",
    title: "Data Center Equipment",
    description: "Procurement of data center equipment and installation services",
    publishDate: "2024-04-01",
    openingDate: "2024-05-01",
    bidValidity: "90",
    status: "draft",
    approvalStatus: "pending",
    comments: [
      {
        id: 1,
        text: "Initial draft completed",
        author: "Procurement Team",
        createdAt: "2024-03-25T09:00:00Z",
        timestamp: "2024-03-25T09:00:00Z",
      },
    ],
    documents: [],
  },
];
