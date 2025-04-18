
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface DocumentUploadProps {
  documents: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (index: number) => void;
}

const DocumentUpload = ({
  documents,
  onFileChange,
  onRemoveDocument,
}: DocumentUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="documents">Company Documents</Label>
      <div className="flex items-center gap-4">
        <Input
          id="documents"
          type="file"
          onChange={onFileChange}
          multiple
          className="cursor-pointer"
          accept=".pdf,.doc,.docx"
        />
        <Button type="button" variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
      
      {documents.length > 0 && (
        <div className="mt-4 space-y-2">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm truncate">{doc.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveDocument(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
