
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SpecificationDocument } from "@/types/specification";

interface SpecificationSubmissionProps {
  specification: SpecificationDocument | null;
  onSpecificationUpdate: (spec: SpecificationDocument) => void;
}

const SpecificationSubmission = ({
  specification,
  onSpecificationUpdate,
}: SpecificationSubmissionProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(specification?.title || "");
  const [description, setDescription] = useState(specification?.description || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} has been selected for upload.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and upload a document.",
        variant: "destructive",
      });
      return;
    }

    // Mock submission - in real app, this would call an API
    const newSpecification: SpecificationDocument = {
      id: Date.now(),
      title,
      description,
      version: 1,
      status: "submitted",
      submittedBy: 1, // Mock user ID
      submittedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      documentUrl: URL.createObjectURL(selectedFile),
      committeeId: 1, // Mock committee ID
      comments: [],
    };

    onSpecificationUpdate(newSpecification);
    toast({
      title: "Specification Submitted",
      description: "Your specification has been submitted successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Specification Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter specification title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter specification description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">Upload Specification Document</Label>
        <div className="flex items-center gap-4">
          <Input
            id="document"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="cursor-pointer"
          />
          <Button type="button" variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <File className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{selectedFile.name}</span>
        </div>
      )}

      <Button type="submit" className="w-full flex items-center gap-2">
        <Send className="h-4 w-4" />
        Submit Specification
      </Button>
    </form>
  );
};

export default SpecificationSubmission;
