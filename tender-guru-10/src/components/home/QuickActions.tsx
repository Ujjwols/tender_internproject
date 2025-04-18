
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, FileText, Users, MessageSquare } from "lucide-react";

interface QuickActionsProps {
  onShowCommitteeForm: () => void;
  onShowTenderForm: () => void;
  onShowVendorForm: () => void;
  onShowComplaints: () => void;
}

const QuickActions = ({
  onShowCommitteeForm,
  onShowTenderForm,
  onShowVendorForm,
  onShowComplaints,
}: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold">Committee Formation</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Create and manage specification committees
        </p>
        <Button onClick={onShowCommitteeForm} className="w-full">
          Create Committee
        </Button>
      </Card>

      <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Active Tenders</h3>
        </div>
        <p className="text-gray-600 mb-4">
          View and manage ongoing tender processes
        </p>
        <Button variant="outline" className="w-full" onClick={onShowTenderForm}>
          Create Tender
        </Button>
      </Card>

      <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold">Vendor Management</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Register and manage vendor profiles
        </p>
        <Button variant="outline" className="w-full" onClick={onShowVendorForm}>
          Register Vendor
        </Button>
      </Card>

      <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold">Complaints</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Manage and track complaints
        </p>
        <Button variant="outline" className="w-full" onClick={onShowComplaints}>
          View Complaints
        </Button>
      </Card>
    </div>
  );
};

export default QuickActions;
