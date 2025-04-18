
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SpecificationSubmission from "./SpecificationSubmission";
import ReviewScheduler from "./ReviewScheduler";
import ReviewMinutes from "./ReviewMinutes";
import DocumentApproval from "./DocumentApproval";
import VersionHistory from "./VersionHistory";
import CommitteeFormation from "./CommitteeFormation";
import TaskManager from "./TaskManager";
import ReviewTracker from "./ReviewTracker";
import type { SpecificationDocument, ReviewSession, DocumentVersion, TaskAssignment } from "@/types/specification";
import { 
  mockSpecifications, 
  mockReviews, 
  getSpecificationById, 
  getReviewBySpecificationId,
  getVersionHistory,
} from "@/mock/specificationData";

const SpecificationManagement = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("committee");
  const [currentSpecification, setCurrentSpecification] = useState<SpecificationDocument | null>(null);
  const [currentReview, setCurrentReview] = useState<ReviewSession | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const spec = getSpecificationById(Number(id));
      if (spec) {
        setCurrentSpecification(spec);
        const associatedReview = getReviewBySpecificationId(spec.id);
        if (associatedReview) {
          setCurrentReview(associatedReview);
        }
      }
    }
  }, [id]);

  const handleSpecificationUpdate = (spec: SpecificationDocument) => {
    setCurrentSpecification(spec);
    toast({
      title: "Specification Updated",
      description: "The specification has been successfully updated.",
    });
  };

  const handleTaskAssignment = (task: TaskAssignment) => {
    if (currentSpecification) {
      const updatedSpec = {
        ...currentSpecification,
        tasks: [...(currentSpecification.tasks || []), task],
      };
      setCurrentSpecification(updatedSpec);
      toast({
        title: "Task Assigned",
        description: `Task "${task.title}" has been assigned successfully.`,
      });
      // Mock notification sending
      console.log(`Sending ${task.notificationType} notification to member ${task.assignedTo}`);
    }
  };

  const handleReviewUpdate = (review: ReviewSession) => {
    setCurrentReview(review);
    if (currentSpecification) {
      const updatedSpec: SpecificationDocument = {
        ...currentSpecification,
        reviewTracking: [
          ...(currentSpecification.reviewTracking || []),
          {
            id: Date.now(),
            documentVersion: currentSpecification.version,
            reviewDate: review.scheduledDate,
            status: review.status,
            comments: review.comments,
            nextReviewDate: review.nextReviewDate,
            notifiedMembers: review.reviewers.map(reviewer => ({
              memberId: reviewer.id,
              notified: true,
              notificationMethod: "both" as const,
              acknowledgedAt: undefined,
            })),
          },
        ],
      };
      setCurrentSpecification(updatedSpec);
    }
    toast({
      title: "Review Updated",
      description: "The review session has been successfully updated.",
    });
  };

  return (
    <div className="container mx-auto pt-20 px-4 min-h-screen">
      <Card className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg p-6 rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-7 gap-4 p-1 bg-muted/20 rounded-lg">
            <TabsTrigger value="committee" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Committee
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="submission" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Submission
            </TabsTrigger>
            <TabsTrigger value="versions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Versions
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Review
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Tracking
            </TabsTrigger>
            <TabsTrigger value="approval" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Approval
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
            <TabsContent value="committee">
              <CommitteeFormation
                specification={currentSpecification}
                onSpecificationUpdate={handleSpecificationUpdate}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManager
                specification={currentSpecification}
                onTaskAssignment={handleTaskAssignment}
              />
            </TabsContent>

            <TabsContent value="submission">
              <SpecificationSubmission
                specification={currentSpecification}
                onSpecificationUpdate={handleSpecificationUpdate}
              />
            </TabsContent>

            <TabsContent value="versions">
              {currentSpecification?.versionHistory ? (
                <VersionHistory
                  versions={currentSpecification.versionHistory}
                  onCompareVersions={(v1, v2) => console.log("Comparing versions:", v1, v2)}
                  onViewVersion={(v) => console.log("Viewing version:", v)}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No version history available
                </div>
              )}
            </TabsContent>

            <TabsContent value="review">
              <ReviewScheduler
                specification={currentSpecification}
                review={currentReview}
                onReviewUpdate={handleReviewUpdate}
              />
            </TabsContent>

            <TabsContent value="tracking">
              <ReviewTracker
                specification={currentSpecification}
                review={currentReview}
              />
            </TabsContent>

            <TabsContent value="approval">
              <DocumentApproval
                specification={currentSpecification}
                review={currentReview}
                onSpecificationUpdate={handleSpecificationUpdate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default SpecificationManagement;
