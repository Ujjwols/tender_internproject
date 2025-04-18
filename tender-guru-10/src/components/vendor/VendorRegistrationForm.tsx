
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { Vendor } from "@/types/vendor";
import CompanyInfoFields from "./form/CompanyInfoFields";
import DocumentUpload from "./form/DocumentUpload";

interface VendorRegistrationFormProps {
  onClose: () => void;
}

const VendorRegistrationForm = ({ onClose }: VendorRegistrationFormProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<File[]>([]);
  const [vendorData, setVendorData] = useState({
    companyName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    address: "",
    category: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor: Partial<Vendor> = {
      ...vendorData,
      documents,
      status: "pending",
      qualificationScore: 0,
      createdAt: new Date().toISOString(),
    };
    
    console.log("Vendor registration submitted:", newVendor);
    
    toast({
      title: "Registration Submitted",
      description: "Your vendor registration has been submitted for review.",
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorData(prev => ({
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
          <h2 className="text-2xl font-bold">Vendor Registration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CompanyInfoFields
            {...vendorData}
            onChange={handleInputChange}
          />

          <DocumentUpload
            documents={documents}
            onFileChange={handleFileChange}
            onRemoveDocument={removeDocument}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VendorRegistrationForm;
