
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { BidSecurity } from "@/types/procurement";

interface BidSecurityManagerProps {
  tenderId: number;
  bidSecurities: BidSecurity[];
  onUpdate: (securities: BidSecurity[]) => void;
}

const BidSecurityManager = ({
  tenderId,
  bidSecurities,
  onUpdate,
}: BidSecurityManagerProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    type: "bank_guarantee" as BidSecurity["type"],
    validUntil: "",
    documentRef: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSecurity: BidSecurity = {
      id: Date.now(),
      tenderId,
      amount: Number(formData.amount),
      type: formData.type,
      validUntil: formData.validUntil,
      status: "active",
      documentRef: formData.documentRef,
    };

    onUpdate([...bidSecurities, newSecurity]);
    setFormData({
      amount: "",
      type: "bank_guarantee",
      validUntil: "",
      documentRef: "",
    });

    toast({
      title: "Bid Security Added",
      description: "New bid security has been successfully recorded.",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as BidSecurity["type"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_guarantee">Bank Guarantee</SelectItem>
                <SelectItem value="cash_deposit">Cash Deposit</SelectItem>
                <SelectItem value="insurance_bond">Insurance Bond</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) =>
                setFormData({ ...formData, validUntil: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="documentRef">Document Reference</Label>
            <Input
              id="documentRef"
              value={formData.documentRef}
              onChange={(e) =>
                setFormData({ ...formData, documentRef: e.target.value })
              }
            />
          </div>
        </div>

        <Button type="submit">Add Bid Security</Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Bid Securities</h3>
        {bidSecurities.length === 0 ? (
          <p className="text-gray-500">No bid securities recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {bidSecurities.map((security) => (
              <div
                key={security.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {security.type.replace("_", " ").toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: ${security.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Valid until: {new Date(security.validUntil).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const updated = bidSecurities.map((s) =>
                      s.id === security.id
                        ? { ...s, status: "released" as const }
                        : s
                    );
                    onUpdate(updated);
                    toast({
                      title: "Status Updated",
                      description: "Bid security has been released.",
                    });
                  }}
                  disabled={security.status !== "active"}
                >
                  {security.status === "active" ? "Release" : "Released"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BidSecurityManager;
