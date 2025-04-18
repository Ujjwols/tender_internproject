
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, X } from "lucide-react";
import TenderPreview from "./TenderPreview";
import { Tender } from "@/types/tender";
import IFBNumberField from "./form/IFBNumberField";
import BasicTenderInfo from "./form/BasicTenderInfo";
import TenderDates from "./form/TenderDates";
import DocumentUpload from "./form/DocumentUpload";

interface TenderFormProps {
  onClose: () => void;
  onSubmit?: (tender: Omit<Tender, "id" | "comments" | "documents">) => void;
}

const TenderForm = ({ onClose, onSubmit }: TenderFormProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [tenderData, setTenderData] = useState({
    ifbNumber: "",
    title: "",
    description: "",
    publishDate: "",
    openingDate: "",
    bidValidity: "90",
    status: "draft" as const,
    approvalStatus: "pending" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const publish = new Date(tenderData.publishDate);
    const opening = new Date(tenderData.openingDate);
    
    if (opening <= publish) {
      toast({
        title: "Invalid Dates",
        description: "Opening date must be after publish date",
        variant: "destructive",
      });
      return;
    }

    const tender = {
      ...tenderData,
      bidValidity: String(tenderData.bidValidity),
    };

    onSubmit?.(tender);
    
    toast({
      title: "Tender Created",
      description: "Tender has been created successfully.",
    });
    
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTenderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIFBChange = (name: string, value: string) => {
    setTenderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Files Added",
        description: `${newFiles.length} file(s) added successfully.`,
      });
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Tender</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <IFBNumberField 
            ifbNumber={tenderData.ifbNumber}
            onChange={handleIFBChange}
          />

          <BasicTenderInfo
            title={tenderData.title}
            description={tenderData.description}
            onChange={handleInputChange}
          />

          <TenderDates
            publishDate={tenderData.publishDate}
            openingDate={tenderData.openingDate}
            bidValidity={tenderData.bidValidity}
            onChange={handleInputChange}
          />

          <DocumentUpload
            documents={documents}
            onFileChange={handleFileChange}
            onRemoveDocument={removeDocument}
          />

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Tender
            </Button>
          </div>
        </form>
      </Card>

      {showPreview && (
        <TenderPreview
          open={showPreview}
          onOpenChange={setShowPreview}
          tender={{ ...tenderData, documents }}
        />
      )}
    </div>
  );
};

export default TenderForm;
