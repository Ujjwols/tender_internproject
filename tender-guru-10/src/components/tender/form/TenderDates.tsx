
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenderDatesProps {
  publishDate: string;
  openingDate: string;
  bidValidity: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TenderDates = ({ publishDate, openingDate, bidValidity, onChange }: TenderDatesProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            name="publishDate"
            type="date"
            value={publishDate}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="openingDate">Opening Date</Label>
          <Input
            id="openingDate"
            name="openingDate"
            type="date"
            value={openingDate}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bidValidity">Bid Validity (in days)</Label>
        <Input
          id="bidValidity"
          name="bidValidity"
          type="number"
          value={bidValidity}
          onChange={onChange}
          min="1"
          required
        />
      </div>
    </>
  );
};

export default TenderDates;
