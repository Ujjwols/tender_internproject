
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoFieldsProps {
  companyName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyInfoFields = ({
  companyName,
  registrationNumber,
  email,
  phone,
  address,
  onChange,
}: CompanyInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          value={companyName}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="registrationNumber">Registration Number</Label>
        <Input
          id="registrationNumber"
          name="registrationNumber"
          value={registrationNumber}
          onChange={onChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={address}
          onChange={onChange}
          required
        />
      </div>
    </>
  );
};

export default CompanyInfoFields;
