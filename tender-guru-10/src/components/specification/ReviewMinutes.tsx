
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save } from "lucide-react";
import type { ReviewSession } from "@/types/specification";

interface ReviewMinutesProps {
  review: ReviewSession | null;
  onReviewUpdate: (review: ReviewSession) => void;
}

const ReviewMinutes = ({ review, onReviewUpdate }: ReviewMinutesProps) => {
  const { toast } = useToast();

  const handleMinutesUpdate = (minutes: string) => {
    if (!review) {
      toast({
        title: "Error",
        description: "No active review session found",
        variant: "destructive",
      });
      return;
    }

    const updatedReview: ReviewSession = {
      ...review,
      minutes,
      status: "completed",
    };

    onReviewUpdate(updatedReview);
    toast({
      title: "Minutes Updated",
      description: "Review minutes have been saved successfully",
    });
  };

  if (!review) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please schedule a review session first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Review Minutes</h3>
        <div className="text-sm text-gray-500">
          Review Date: {new Date(review.scheduledDate).toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="minutes">Meeting Minutes</Label>
          <Textarea
            id="minutes"
            value={review.minutes || ""}
            onChange={(e) => handleMinutesUpdate(e.target.value)}
            placeholder="Enter the review meeting minutes..."
            className="min-h-[200px]"
          />
        </div>

        {review.documents.length > 0 && (
          <div className="space-y-2">
            <Label>Attached Documents</Label>
            <div className="space-y-2">
              {review.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => handleMinutesUpdate(review.minutes || "")}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Minutes
        </Button>
      </div>
    </div>
  );
};

export default ReviewMinutes;
