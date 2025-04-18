
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hourglass, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SpecificationDocument } from "@/types/specification";
import { mockSpecifications } from "@/mock/specificationData";

interface SpecificationTrackerProps {
  committeeId: number;
}

const SpecificationTracker = ({ committeeId }: SpecificationTrackerProps) => {
  const { toast } = useToast();
  const [specifications] = useState<SpecificationDocument[]>(mockSpecifications);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "revision_required":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "under_review":
        return <Hourglass className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "revision_required":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendReminder = (specId: number) => {
    toast({
      title: "Reminder Sent",
      description: "A reminder has been sent to the committee members.",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Specification Tracking</h3>
      {specifications.map((spec) => (
        <Card key={spec.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{spec.title}</h4>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(spec.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(spec.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(spec.status)}
                  {spec.status.replace("_", " ")}
                </span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReminder(spec.id)}
              >
                Send Reminder
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SpecificationTracker;
