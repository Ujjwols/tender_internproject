
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BasicInfoFieldsProps {
  name: string;
  purpose: string;
  onNameChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
  disabled?: boolean;
}

const BasicInfoFields = ({
  name,
  purpose,
  onNameChange,
  onPurposeChange,
}: BasicInfoFieldsProps) => {
  const { toast } = useToast();
  const [touched, setTouched] = useState({
    name: false,
    purpose: false,
  });

  const handleNameChange = (value: string) => {
    onNameChange(value);
    if (touched.name && value.length < 3) {
      toast({
        title: "Invalid Name",
        description: "Committee name must be at least 3 characters long",
        variant: "destructive",
      });
    }
  };

  const handlePurposeChange = (value: string) => {
    onPurposeChange(value);
    if (touched.purpose && value.length < 10) {
      toast({
        title: "Invalid Purpose",
        description: "Purpose must be at least 10 characters long",
        variant: "destructive",
      });
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    if (name.length < 3) {
      toast({
        title: "Invalid Name",
        description: "Committee name must be at least 3 characters long",
        variant: "destructive",
      });
    }
  };

  const handlePurposeBlur = () => {
    setTouched(prev => ({ ...prev, purpose: true }));
    if (purpose.length < 10) {
      toast({
        title: "Invalid Purpose",
        description: "Purpose must be at least 10 characters long",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Committee Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Enter committee name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Input
          id="purpose"
          value={purpose}
          onChange={(e) => handlePurposeChange(e.target.value)}
          onBlur={handlePurposeBlur}
          placeholder="Enter committee purpose"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
