
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BidAmountFieldProps {
  bidAmount: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BidAmountField = ({ bidAmount, onChange }: BidAmountFieldProps) => {
  return (
    <div>
      <Label htmlFor="bidAmount">Bid Amount</Label>
      <Input
        id="bidAmount"
        name="bidAmount"
        type="number"
        step="0.01"
        value={bidAmount}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default BidAmountField;
