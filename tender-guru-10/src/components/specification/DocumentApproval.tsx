
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import type { SpecificationDocument, ReviewSession } from "@/types/specification";

interface DocumentApprovalProps {
  specification: SpecificationDocument | null;
  review: ReviewSession | null;
  onSpecificationUpdate: (spec: SpecificationDocument) => void;
}

const DocumentApproval = ({
  specification,
  review,
  onSpecificationUpdate,
}: DocumentApprovalProps) => {
  const { toast } = useToast();

  const handleApproval = (approved: boolean) => {
    if (!specification) {
      toast({
        title: "Error",
        description: "No specification document found",
        variant: "destructive",
      });
      return;
    }

    const updatedSpecification: SpecificationDocument = {
      ...specification,
      status: approved ? "approved" : "rejected",
      lastModified: new Date().toISOString(),
    };

    onSpecificationUpdate(updatedSpecification);
    toast({
      title: approved ? "Document Approved" : "Document Rejected",
      description: `The specification has been ${approved ? "approved" : "rejected"} successfully`,
    });
  };

  if (!specification || !review) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please complete the review process first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Document Approval</h3>
        <Badge
          variant={specification.status === "approved" ? "default" : "secondary"}
        >
          {specification.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <Label>Specification Details</Label>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Title:</span>
              <p>{specification.title}</p>
            </div>
            <div>
              <span className="text-gray-500">Version:</span>
              <p>{specification.version}</p>
            </div>
            <div>
              <span className="text-gray-500">Submitted:</span>
              <p>{new Date(specification.submittedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Last Modified:</span>
              <p>{new Date(specification.lastModified).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {review.minutes && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <Label>Review Minutes</Label>
            <p className="text-sm">{review.minutes}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Attached Documents</Label>
          <div className="space-y-2">
            {review.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{doc.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => handleApproval(true)}
            className="flex-1"
            variant="default"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Document
          </Button>
          <Button
            onClick={() => handleApproval(false)}
            className="flex-1"
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentApproval;
