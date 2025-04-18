
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ComplaintRegistration from "./ComplaintRegistration";
import ComplaintList from "./ComplaintList";
import SecureDocumentViewer from "../evaluation/SecureDocumentViewer";
import { Complaint } from "@/types/complaint";

// Mock data
const mockComplaints: Complaint[] = [
  {
    id: 1,
    title: "Tender Specification Issue",
    description: "Unclear requirements in Section 3.2",
    submittedBy: "Vendor A",
    agencyId: 1,
    status: "pending",
    priority: "high",
    submittedAt: new Date().toISOString(),
    documents: [
      {
        id: 1,
        fileName: "specification_issue.pdf",
        fileType: "application/pdf",
        uploadedAt: new Date().toISOString(),
        fileSize: 1024576
      }
    ],
    responses: [],
    category: "Technical",
    emailNotifications: true
  },
  {
    id: 2,
    title: "Document Access Problem",
    description: "Unable to access bid documents",
    submittedBy: "Vendor B",
    agencyId: 1,
    status: "resolved",
    priority: "medium",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    documents: [],
    responses: [
      {
        id: 1,
        complaintId: 2,
        response: "Access restored. Issue was due to temporary system maintenance.",
        respondedBy: "System Admin",
        respondedAt: new Date().toISOString()
      }
    ],
    category: "Access",
    emailNotifications: true
  }
];

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const handleNewComplaint = (complaint: Omit<Complaint, "id" | "submittedAt" | "responses">) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: complaints.length + 1,
      submittedAt: new Date().toISOString(),
      responses: []
    };
    setComplaints([...complaints, newComplaint]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Complaint Management</h2>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Complaints List</TabsTrigger>
          <TabsTrigger value="register">Register Complaint</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="p-4">
            <ComplaintList complaints={complaints} />
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="p-4">
            <ComplaintRegistration onSubmit={handleNewComplaint} />
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-4">
            <SecureDocumentViewer teamId={1} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplaintManagement;
