
import BidSecurityManager from "../BidSecurityManager";
import type { BidSecurity } from "@/types/procurement";

interface BidSecurityTabProps {
  tenderId: number;
  bidSecurities: BidSecurity[];
  onUpdate: (securities: BidSecurity[]) => void;
}

const BidSecurityTab = ({ tenderId, bidSecurities, onUpdate }: BidSecurityTabProps) => {
  return (
    <BidSecurityManager
      tenderId={tenderId}
      bidSecurities={bidSecurities}
      onUpdate={onUpdate}
    />
  );
};

export default BidSecurityTab;

