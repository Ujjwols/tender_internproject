
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { History, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewHistoryEntry {
  id: number;
  action: 'approved' | 'revision_requested';
  timestamp: string;
  comment?: string;
}

interface ReviewHistoryProps {
  history: ReviewHistoryEntry[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const ReviewHistory = ({ history, showHistory, setShowHistory }: ReviewHistoryProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowHistory(true)}
      >
        <History className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </Button>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review History</DialogTitle>
            <DialogDescription>
              Timeline of review actions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                {entry.action === 'approved' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium">
                    {entry.action === 'approved' ? 'Specification Approved' : 'Revision Requested'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  {entry.comment && (
                    <p className="mt-2 text-gray-700">{entry.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewHistory;
