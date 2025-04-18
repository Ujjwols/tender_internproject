
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicTenderInfoProps {
  title: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicTenderInfo = ({ title, description, onChange }: BasicTenderInfoProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Tender Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Enter tender title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Enter tender description"
          required
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default BasicTenderInfo;
