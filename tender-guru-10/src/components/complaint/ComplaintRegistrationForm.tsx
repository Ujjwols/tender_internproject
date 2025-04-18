
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Scan, Upload } from "lucide-react";
import type { Complaint } from "@/types/complaint";

interface Props {
  onSubmit: (complaint: Omit<Complaint, "id" | "submittedAt" | "responses">) => void;
}

const ComplaintRegistrationForm = ({ onSubmit }: Props) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    submittedBy: "",
    agencyId: 1,
    status: "pending" as const,
    priority: "medium" as const,
    category: "Technical" as const,
    emailNotifications: true,
    documents: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...formData,
      documents: formData.documents.map((file, index) => ({
        id: index + 1,
        fileName: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
      })),
    });

    toast({
      title: "Success",
      description: "Complaint registered successfully",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      submittedBy: "",
      agencyId: 1,
      status: "pending",
      priority: "medium",
      category: "Technical",
      emailNotifications: true,
      documents: [],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...Array.from(e.target.files as FileList)],
      }));
    }
  };

  const simulateDocumentScanning = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast({
        title: "Document Scanned",
        description: "Document has been successfully scanned and attached",
      });
      // In a real app, this would process the scanned document
      const mockScannedFile = new File([""], "scanned_document.pdf", { type: "application/pdf" });
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, mockScannedFile],
      }));
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter complaint title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your complaint"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="submittedBy">Submitted By</Label>
          <Input
            id="submittedBy"
            value={formData.submittedBy}
            onChange={e => setFormData(prev => ({ ...prev, submittedBy: e.target.value }))}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={value => setFormData(prev => ({ ...prev, priority: value as any }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <h4 className="font-medium">Supporting Documents</h4>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <Input
                id="documents"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("documents")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={simulateDocumentScanning}
              disabled={scanning}
            >
              <Scan className="h-4 w-4 mr-2" />
              {scanning ? "Scanning..." : "Scan Document"}
            </Button>
          </div>

          {formData.documents.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {formData.documents.length} file(s) attached
              </p>
              <ul className="mt-2 space-y-1">
                {formData.documents.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <Button type="submit">Submit Complaint</Button>
    </form>
  );
};

export default ComplaintRegistrationForm;
