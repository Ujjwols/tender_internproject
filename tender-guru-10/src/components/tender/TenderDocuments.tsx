
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File } from "lucide-react";

interface TenderDocumentsProps {
  tenderId: number;
  documents: File[];
  onUpload: (tenderId: number, files: FileList) => void;
  onPreview: (document: File) => void;
}

const TenderDocuments = ({
  tenderId,
  documents,
  onUpload,
  onPreview,
}: TenderDocumentsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{documents.length} file(s)</span>
      <div className="flex gap-2">
        <Input
          type="file"
          className="hidden"
          id={`upload-${tenderId}`}
          multiple
          onChange={(e) => {
            if (e.target.files) {
              onUpload(tenderId, e.target.files);
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(`upload-${tenderId}`)?.click()}
        >
          <Upload className="h-4 w-4" />
        </Button>
        {documents.map((doc, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onPreview(doc)}
          >
            <File className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TenderDocuments;
