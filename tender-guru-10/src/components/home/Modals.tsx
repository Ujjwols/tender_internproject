
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommitteeForm from "@/components/committee/CommitteeForm";
import TenderForm from "@/components/tender/TenderForm";
import VendorRegistrationForm from "@/components/vendor/VendorRegistrationForm";
import ComplaintManagement from "@/components/complaint/ComplaintManagement";

interface ModalsProps {
  showComplaints: boolean;
  showCommitteeForm: boolean;
  showTenderForm: boolean;
  showVendorForm: boolean;
  onCloseComplaints: () => void;
  onCloseCommitteeForm: () => void;
  onCloseTenderForm: () => void;
  onCloseVendorForm: () => void;
}

const Modals = ({
  showComplaints,
  showCommitteeForm,
  showTenderForm,
  showVendorForm,
  onCloseComplaints,
  onCloseCommitteeForm,
  onCloseTenderForm,
  onCloseVendorForm,
}: ModalsProps) => {
  return (
    <>
      {showComplaints && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Complaint Management</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCloseComplaints}
                >
                  Close
                </Button>
              </div>
              <ComplaintManagement />
            </div>
          </Card>
        </div>
      )}

      {showCommitteeForm && (
        <CommitteeForm onClose={onCloseCommitteeForm} />
      )}

      {showTenderForm && (
        <TenderForm onClose={onCloseTenderForm} />
      )}

      {showVendorForm && (
        <VendorRegistrationForm onClose={onCloseVendorForm} />
      )}
    </>
  );
};

export default Modals;
