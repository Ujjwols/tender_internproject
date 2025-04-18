
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { type SecureDocument } from "@/types/evaluation";

interface DocumentCardProps {
  document: SecureDocument;
  onView: (doc: SecureDocument) => void;
}

const DocumentCard = ({ document, onView }: DocumentCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <p className="font-medium">{document.name}</p>
            <p className="text-sm text-gray-500">
              {(document.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onView(document)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default DocumentCard;
