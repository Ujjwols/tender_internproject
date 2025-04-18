
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SpecificationDocument } from "@/types/specification";
import type { Letter } from "@/types/letter";
import LetterUpload from "../committee/letter/LetterUpload";

interface CommitteeFormationProps {
  specification: SpecificationDocument | null;
  onSpecificationUpdate: (spec: SpecificationDocument) => void;
}

const CommitteeFormation = ({ specification, onSpecificationUpdate }: CommitteeFormationProps) => {
  const { toast } = useToast();
  const [notificationType, setNotificationType] = useState<"email" | "sms" | "both">("both");

  const handleLetterUpload = (letter: Letter) => {
    if (specification) {
      const updatedSpec = {
        ...specification,
        committeeFormationLetter: letter,
      };
      onSpecificationUpdate(updatedSpec);
      
      // Mock notification sending
      console.log("Sending committee formation notifications...");
      if (notificationType === "email" || notificationType === "both") {
        console.log("Sending email notifications to committee members");
      }
      if (notificationType === "sms" || notificationType === "both") {
        console.log("Sending SMS notifications to committee members");
      }
    }
  };

  if (!specification) {
    return (
      <div className="text-center py-8 text-gray-500">
        No specification selected
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Committee Formation</h2>
        <LetterUpload onUpload={handleLetterUpload} />
      </div>

      {specification.committeeFormationLetter && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Formation Letter Details</h3>
          <p className="text-sm text-gray-600">
            Reference: {specification.committeeFormationLetter.referenceNumber}
          </p>
          <p className="text-sm text-gray-600">
            Issued: {new Date(specification.committeeFormationLetter.issueDate).toLocaleDateString()}
          </p>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <Label>Notification Preferences</Label>
          <div className="flex gap-4 mt-2">
            <Button
              variant={notificationType === "email" ? "default" : "outline"}
              onClick={() => setNotificationType("email")}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Only
            </Button>
            <Button
              variant={notificationType === "sms" ? "default" : "outline"}
              onClick={() => setNotificationType("sms")}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              SMS Only
            </Button>
            <Button
              variant={notificationType === "both" ? "default" : "outline"}
              onClick={() => setNotificationType("both")}
            >
              Both
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeFormation;
