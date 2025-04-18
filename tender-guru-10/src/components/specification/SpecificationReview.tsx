
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Upload, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { SpecificationDocument, ReviewSession } from "@/types/specification";

interface SpecificationReviewProps {
  specification: SpecificationDocument | null;
  review: ReviewSession | null;
  onReviewUpdate: (review: ReviewSession) => void;
}

const SpecificationReview = ({
  specification,
  review,
  onReviewUpdate,
}: SpecificationReviewProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState("");

  const handleScheduleReview = () => {
    if (!date || !location || !specification) {
      toast({
        title: "Validation Error",
        description: "Please select a date and location for the review.",
        variant: "destructive",
      });
      return;
    }

    const newReview: ReviewSession = {
      id: Date.now(),
      specificationId: specification.id,
      scheduledDate: date.toISOString(),
      status: "scheduled",
      reviewers: [],
      comments: [],
      documents: [],
    };

    onReviewUpdate(newReview);
    
    toast({
      title: "Review Scheduled",
      description: `Review scheduled for ${format(date, "PPP")}`,
    });
  };

  if (!specification) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please submit a specification first to schedule a review.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Review Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter review location"
        />
      </div>

      <Button onClick={handleScheduleReview} className="w-full">
        Schedule Review
      </Button>

      {review && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Scheduled for: {format(new Date(review.scheduledDate), "PPP")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationReview;
