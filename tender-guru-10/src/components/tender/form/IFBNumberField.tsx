
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Hash } from "lucide-react";

interface IFBNumberFieldProps {
  ifbNumber: string;
  onChange: (name: string, value: string) => void;
}

const IFBNumberField = ({ ifbNumber, onChange }: IFBNumberFieldProps) => {
  const { toast } = useToast();

  const generateIFBNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newIfbNumber = `IFB-${year}${month}-${random}`;
    onChange("ifbNumber", newIfbNumber);
    
    toast({
      title: "IFB Number Generated",
      description: `New IFB number: ${newIfbNumber}`,
    });
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Label htmlFor="ifbNumber">IFB Number</Label>
        <Input
          id="ifbNumber"
          name="ifbNumber"
          value={ifbNumber}
          readOnly
          placeholder="Generate IFB Number"
        />
      </div>
      <Button 
        type="button" 
        onClick={generateIFBNumber}
        className="flex items-center gap-2"
      >
        <Hash className="h-4 w-4" />
        Generate
      </Button>
    </div>
  );
};

export default IFBNumberField;
