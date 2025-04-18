import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenderPreview from "./TenderPreview";
import DocumentViewer from "./DocumentViewer";
import TenderSearchFilter from "./TenderSearchFilter";
import TenderTable from "./TenderTable";
import TenderForm from "./TenderForm";
import { getNextStatus } from "@/utils/tenderUtils";
import { Tender, TenderStatus, TenderComment } from "@/types/tender";
import { mockTenders } from "@/mock/tenderData";

const TenderList = () => {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "all">("all");
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const canCreateTender = true;
  const canApproveTender = true;

  const handleCreateTender = (tenderData: Omit<Tender, "id" | "comments" | "documents">) => {
    const newTender: Tender = {
      ...tenderData,
      id: tenders.length + 1,
      comments: [],
      documents: [],
    };

    setTenders((prev) => [newTender, ...prev]);
    setShowCreateForm(false);

    toast({
      title: "Success",
      description: "New tender has been created successfully",
    });
  };

  const handleStatusTransition = (tenderId: number) => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          const nextStatus = getNextStatus(tender.status);
          if (nextStatus) {
            toast({
              title: "Status Updated",
              description: `Tender status changed from ${tender.status} to ${nextStatus}`,
            });
            return { ...tender, status: nextStatus };
          }
        }
        return tender;
      })
    );
  };

  const handleApprovalStatusUpdate = (tenderId: number, status: "approved" | "rejected") => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          toast({
            title: "Approval Status Updated",
            description: `Tender has been ${status}`,
          });
          return { ...tender, approvalStatus: status };
        }
        return tender;
      })
    );
  };

  const handleAddComment = (tenderId: number, text: string) => {
    const now = new Date();
    const newComment: TenderComment = {
      id: Date.now(),
      text,
      author: "Unknown User",
      createdAt: now.toISOString(),
      timestamp: now.toISOString(),
    };

    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          return {
            ...tender,
            comments: [newComment, ...tender.comments],
          };
        }
        return tender;
      })
    );

    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully",
    });
  };

  const handleDocumentUpload = (tenderId: number, files: FileList) => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          const newDocuments = Array.from(files);
          return {
            ...tender,
            documents: [...tender.documents, ...newDocuments],
          };
        }
        return tender;
      })
    );

    toast({
      title: "Documents Uploaded",
      description: `${files.length} document(s) have been uploaded successfully.`,
    });
  };

  const handleDocumentPreview = (document: File) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.ifbNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tenders</h2>
        {canCreateTender && (
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Tender
          </Button>
        )}
      </div>

      <TenderSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TenderTable
        tenders={filteredTenders}
        onPreview={(tender) => {
          setSelectedTender(tender);
          setShowPreview(true);
        }}
        onApprovalStatusUpdate={canApproveTender ? handleApprovalStatusUpdate : undefined}
        onStatusTransition={handleStatusTransition}
        onAddComment={handleAddComment}
        onDocumentUpload={handleDocumentUpload}
        onDocumentPreview={handleDocumentPreview}
        showComments={showComments}
        setShowComments={setShowComments}
      />

      {selectedTender && (
        <TenderPreview
          open={showPreview}
          onOpenChange={setShowPreview}
          tender={selectedTender}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          open={showDocumentViewer}
          onOpenChange={setShowDocumentViewer}
          document={selectedDocument}
        />
      )}

      {showCreateForm && (
        <TenderForm 
          onClose={() => setShowCreateForm(false)} 
          onSubmit={handleCreateTender}
        />
      )}
    </div>
  );
};

export default TenderList;
