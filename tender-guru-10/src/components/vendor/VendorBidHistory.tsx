
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VendorBid } from "@/types/vendor";

interface VendorBidHistoryProps {
  vendorId: number;
  bids: VendorBid[];
}

const VendorBidHistory = ({ vendorId, bids }: VendorBidHistoryProps) => {
  const vendorBids = bids.filter((bid) => bid.vendorId === vendorId);

  return (
    <ScrollArea className="h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tender ID</TableHead>
            <TableHead>Bid Amount</TableHead>
            <TableHead>Technical Score</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendorBids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell>{bid.tenderId}</TableCell>
              <TableCell>${bid.bidAmount.toLocaleString()}</TableCell>
              <TableCell>{bid.technicalScore}</TableCell>
              <TableCell>
                {new Date(bid.submissionDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    bid.status === "accepted"
                      ? "default"
                      : bid.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {bid.status.replace("_", " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default VendorBidHistory;
