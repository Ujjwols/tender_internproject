
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DocumentCard from "./document/DocumentCard";
import AccessLogDialog from "./document/AccessLogDialog";
import PrintDialog from "./document/PrintDialog";
import DocumentViewer from "./document/DocumentViewer";
import type { SecureDocument } from "@/types/evaluation";

interface Props {
  teamId: number;
}

// Mock data
const mockDocuments: SecureDocument[] = [
  {
    id: 1,
    name: "Technical Proposal.pdf",
    type: "application/pdf",
    size: 2500000,
    uploadedAt: new Date().toISOString(),
    isConfidential: true,
    accessHistory: [],
  },
  {
    id: 2,
    name: "Financial Bid.pdf",
    type: "application/pdf",
    size: 1500000,
    uploadedAt: new Date().toISOString(),
    isConfidential: true,
    accessHistory: [],
  },
];

const SecureDocumentViewer = ({ teamId }: Props) => {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<SecureDocument | null>(null);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleViewDocument = (doc: SecureDocument) => {
    setSelectedDoc(doc);
    logAccess(doc.id, "view");
    toast({
      title: "Document Access Logged",
      description: `Access to ${doc.name} has been recorded`,
    });
  };

  const logAccess = (documentId: number, action: "view" | "print") => {
    // In a real app, this would call an API to log the access
    console.log("Access logged:", {
      documentId,
      userId: 1, // This would come from auth context
      timestamp: new Date().toISOString(),
      action,
    });
  };

  const handlePrint = () => {
    if (!selectedDoc) return;
    setShowPrintDialog(true);
  };

  const confirmPrint = () => {
    if (!selectedDoc) return;

    logAccess(selectedDoc.id, "print");
    toast({
      title: "Print Request Logged",
      description: "Your print request has been recorded and will be monitored.",
    });

    if (viewerRef.current) {
      try {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(viewerRef.current.innerHTML);
          printWindow.document.close();
          printWindow.print();
        }
      } catch (error) {
        console.error("Print error:", error);
        toast({
          title: "Print Error",
          description: "Unable to print document. Please try again.",
          variant: "destructive",
        });
      }
    }

    setShowPrintDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Secure Documents</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAccessLog(true)}>
            <Clock className="mr-2 h-4 w-4" />
            Access Log
          </Button>
          {selectedDoc && (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDocuments.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            document={doc} 
            onView={handleViewDocument}
          />
        ))}
      </div>

      {selectedDoc && (
        <DocumentViewer document={selectedDoc} viewerRef={viewerRef} />
      )}

      <PrintDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        onConfirm={confirmPrint}
      />

      <AccessLogDialog
        open={showAccessLog}
        onOpenChange={setShowAccessLog}
        documents={mockDocuments}
      />
    </div>
  );
};

export default SecureDocumentViewer;
