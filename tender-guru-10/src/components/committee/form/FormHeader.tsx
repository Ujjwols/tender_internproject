
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormHeaderProps {
  onClose: () => void;
}

const FormHeader = ({ onClose }: FormHeaderProps) => {
  return (
    <div className="space-y-2 mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Create Committee</h2>
      <p className="text-sm text-gray-500">Fill in the details to create a new committee</p>
    </div>
  );
};

export default FormHeader;
