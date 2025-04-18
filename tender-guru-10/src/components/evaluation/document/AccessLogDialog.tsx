
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { type SecureDocument } from "@/types/evaluation";

interface AccessLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: SecureDocument[];
}

const AccessLogDialog = ({ open, onOpenChange, documents }: AccessLogDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Document Access Log</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-4">
          <ScrollArea className="h-[300px]">
            {documents.map((doc) => (
              <div key={doc.id} className="mb-4">
                <h4 className="font-medium mb-2">{doc.name}</h4>
                {doc.accessHistory.length > 0 ? (
                  doc.accessHistory.map((log, index) => (
                    <div key={index} className="text-sm text-gray-600 mb-1">
                      {new Date(log.timestamp).toLocaleString()} - {log.action}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No access history</p>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AccessLogDialog;
