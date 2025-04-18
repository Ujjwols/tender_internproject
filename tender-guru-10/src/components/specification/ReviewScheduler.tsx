
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Users, Bell } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { SpecificationDocument, ReviewSession } from "@/types/specification";

interface ReviewSchedulerProps {
  specification: SpecificationDocument | null;
  review: ReviewSession | null;
  onReviewUpdate: (review: ReviewSession) => void;
}

const ReviewScheduler = ({
  specification,
  review,
  onReviewUpdate,
}: ReviewSchedulerProps) => {
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
      reviewers: [], // Would be populated from committee members
      comments: [],
      documents: [],
    };

    onReviewUpdate(newReview);
    
    toast({
      title: "Review Scheduled",
      description: `Review scheduled for ${format(date, "PPP")}`,
    });

    // Mock notification sending
    console.log("Sending notifications to review team members");
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

      <div className="flex gap-4">
        <Button
          onClick={handleScheduleReview}
          className="flex-1 flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Schedule & Notify Team
        </Button>
      </div>

      {review && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>Scheduled for: {format(new Date(review.scheduledDate), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{review.reviewers.length} team members notified</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewScheduler;
