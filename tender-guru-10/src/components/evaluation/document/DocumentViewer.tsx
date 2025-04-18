
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock } from "lucide-react";
import { type SecureDocument } from "@/types/evaluation";

interface DocumentViewerProps {
  document: SecureDocument;
  viewerRef: React.RefObject<HTMLDivElement>;
}

const DocumentViewer = ({ document, viewerRef }: DocumentViewerProps) => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={viewerRef}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{document.name}</h4>
          {document.isConfidential && (
            <div className="flex items-center text-amber-600">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm">Confidential</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Document preview would be displayed here in a secure iframe
        </p>
      </div>
    </ScrollArea>
  );
};

export default DocumentViewer;
