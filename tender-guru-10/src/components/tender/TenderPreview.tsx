
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, FileText, Download } from "lucide-react";

interface TenderPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tender: {
    ifbNumber: string;
    title: string;
    description: string;
    publishDate: string;
    openingDate: string;
    bidValidity: string;
    documents?: File[];
  };
}

const TenderPreview = ({ open, onOpenChange, tender }: TenderPreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Tender Preview
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold">IFB Number: {tender.ifbNumber}</h3>
              <p className="text-sm text-gray-500">Reference number for this tender</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Title</h4>
                <p>{tender.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Description</h4>
                <p>{tender.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Publish Date</h4>
                  <p>{tender.publishDate}</p>
                </div>
                <div>
                  <h4 className="font-medium">Opening Date</h4>
                  <p>{tender.openingDate}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Bid Validity</h4>
                <p>{tender.bidValidity} days</p>
              </div>
              
              {tender.documents && tender.documents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Attached Documents</h4>
                  <div className="space-y-2">
                    {tender.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TenderPreview;
