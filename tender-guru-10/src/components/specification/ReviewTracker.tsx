
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { SpecificationDocument, ReviewSession } from "@/types/specification";

interface ReviewTrackerProps {
  specification: SpecificationDocument | null;
  review: ReviewSession | null;
}

const ReviewTracker = ({ specification, review }: ReviewTrackerProps) => {
  if (!specification) {
    return (
      <div className="text-center py-8 text-gray-500">
        No specification selected
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Tracking</h2>

      <div className="space-y-4">
        {specification.reviewTracking?.map((tracking) => (
          <Card key={tracking.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {tracking.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : tracking.status === "in_progress" ? (
                    <Clock className="h-5 w-5 text-blue-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  <h3 className="font-semibold">
                    Review Session - v{tracking.documentVersion}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {new Date(tracking.reviewDate).toLocaleDateString()}
                </p>
                {tracking.nextReviewDate && (
                  <p className="text-sm text-gray-600">
                    Next Review: {new Date(tracking.nextReviewDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge variant={
                tracking.status === "completed" ? "default" :
                tracking.status === "in_progress" ? "secondary" :
                "outline"
              }>
                {tracking.status}
              </Badge>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Notifications</h4>
              <div className="grid grid-cols-2 gap-4">
                {tracking.notifiedMembers.map((member) => (
                  <div key={member.memberId} className="text-sm">
                    <span className="text-gray-600">Member {member.memberId}</span>
                    <Badge variant="outline" className="ml-2">
                      {member.notificationMethod}
                    </Badge>
                    {member.acknowledgedAt && (
                      <span className="text-xs text-green-600 ml-2">
                        ✓ Acknowledged
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {tracking.comments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Comments</h4>
                <div className="space-y-2">
                  {tracking.comments.map((comment, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {comment}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {(!specification.reviewTracking || specification.reviewTracking.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No review tracking information available
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTracker;
