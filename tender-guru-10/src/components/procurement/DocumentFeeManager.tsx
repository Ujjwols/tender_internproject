
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { DocumentFee } from "@/types/procurement";

interface DocumentFeeManagerProps {
  tenderId: number;
  documentFees: DocumentFee[];
  onUpdate: (fees: DocumentFee[]) => void;
}

const DocumentFeeManager = ({
  tenderId,
  documentFees,
  onUpdate,
}: DocumentFeeManagerProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    paymentRef: "",
    receiptNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFee: DocumentFee = {
      id: Date.now(),
      tenderId,
      amount: Number(formData.amount),
      paymentStatus: "pending",
      paymentRef: formData.paymentRef,
      receiptNumber: formData.receiptNumber,
    };

    onUpdate([...documentFees, newFee]);
    setFormData({
      amount: "",
      paymentRef: "",
      receiptNumber: "",
    });

    toast({
      title: "Document Fee Added",
      description: "New document fee has been successfully recorded.",
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
            <Label htmlFor="paymentRef">Payment Reference</Label>
            <Input
              id="paymentRef"
              value={formData.paymentRef}
              onChange={(e) =>
                setFormData({ ...formData, paymentRef: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="receiptNumber">Receipt Number</Label>
          <Input
            id="receiptNumber"
            value={formData.receiptNumber}
            onChange={(e) =>
              setFormData({ ...formData, receiptNumber: e.target.value })
            }
          />
        </div>

        <Button type="submit">Add Document Fee</Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Document Fees History</h3>
        {documentFees.length === 0 ? (
          <p className="text-gray-500">No document fees recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {documentFees.map((fee) => (
              <div
                key={fee.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    Amount: ${fee.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {fee.paymentStatus.toUpperCase()}
                  </p>
                  {fee.receiptNumber && (
                    <p className="text-sm text-gray-500">
                      Receipt: {fee.receiptNumber}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const updated = documentFees.map((f) =>
                      f.id === fee.id
                        ? {
                            ...f,
                            paymentStatus: "paid" as const,
                            paymentDate: new Date().toISOString(),
                          }
                        : f
                    );
                    onUpdate(updated);
                    toast({
                      title: "Payment Confirmed",
                      description: "Document fee payment has been confirmed.",
                    });
                  }}
                  disabled={fee.paymentStatus !== "pending"}
                >
                  {fee.paymentStatus === "pending" ? "Confirm Payment" : "Paid"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentFeeManager;
