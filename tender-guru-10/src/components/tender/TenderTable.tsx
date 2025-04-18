
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Tender } from "@/types/tender";
import { getStatusBadge, getApprovalStatusBadge, canTransitionStatus } from "@/utils/tenderUtils";
import TenderDocuments from "./TenderDocuments";
import CommentsSection from "../review/CommentsSection";

interface TenderTableProps {
  tenders: Tender[];
  onPreview: (tender: Tender) => void;
  onApprovalStatusUpdate?: (tenderId: number, status: "approved" | "rejected") => void;
  onStatusTransition: (tenderId: number) => void;
  onAddComment: (tenderId: number, text: string) => void;
  onDocumentUpload: (tenderId: number, files: FileList) => void;
  onDocumentPreview: (document: File) => void;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
}

const TenderTable = ({
  tenders,
  onPreview,
  onApprovalStatusUpdate,
  onStatusTransition,
  onAddComment,
  onDocumentUpload,
  onDocumentPreview,
  showComments,
  setShowComments,
}: TenderTableProps) => {
  // Mock user permissions - for now we'll allow all actions
  const canEdit = true;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IFB Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Publish Date</TableHead>
            <TableHead>Opening Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.map((tender) => (
            <TableRow key={tender.id}>
              <TableCell className="font-medium">{tender.ifbNumber}</TableCell>
              <TableCell>{tender.title}</TableCell>
              <TableCell>{tender.publishDate}</TableCell>
              <TableCell>{tender.openingDate}</TableCell>
              <TableCell>{getStatusBadge(tender.status)}</TableCell>
              <TableCell>{getApprovalStatusBadge(tender.approvalStatus)}</TableCell>
              <TableCell>
                <TenderDocuments
                  tenderId={tender.id}
                  documents={tender.documents}
                  onUpload={onDocumentUpload}
                  onPreview={onDocumentPreview}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <CommentsSection
                    comments={tender.comments}
                    showComments={showComments}
                    setShowComments={setShowComments}
                    newComment=""
                    setNewComment={() => {}}
                    onAddComment={() => onAddComment(tender.id, "")}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(tender)}
                  >
                    Preview
                  </Button>
                  {canEdit && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {tender.status === "draft" && onApprovalStatusUpdate && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprovalStatusUpdate(tender.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onApprovalStatusUpdate(tender.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {canTransitionStatus(tender.status, "published", tender.approvalStatus) && canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusTransition(tender.id)}
                    >
                      Publish
                    </Button>
                  )}
                  {tender.status === "published" && canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusTransition(tender.id)}
                    >
                      Close
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TenderTable;
