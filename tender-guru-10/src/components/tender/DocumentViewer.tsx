
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: File;
}

const DocumentViewer = ({ open, onOpenChange, document }: DocumentViewerProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const url = URL.createObjectURL(document);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.name;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document Downloaded",
      description: `${document.name} has been downloaded successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Document Preview: {document.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <ScrollArea className="h-[calc(80vh-8rem)] w-full rounded-md border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                {document.type} - {(document.size / 1024).toFixed(2)} KB
              </span>
            </div>
            {document.type.includes('image') ? (
              <img
                src={URL.createObjectURL(document)}
                alt={document.name}
                className="max-w-full h-auto"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">
                  Preview not available for this file type. Please download to view.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
