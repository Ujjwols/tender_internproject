import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProcurementPlan } from "@/types/procurement-plan";
import { format } from 'date-fns';
import { 
  Users, 
  FileText, 
  Search, 
  Building2, 
  FileCheck,
  MessageSquare,
  Clock,
  AlertCircle,
  ChevronRight,
  UserPlus 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface ProcurementPlanViewProps {
  open: boolean;
  onClose: () => void;
  plan: ProcurementPlan;
}

const ProcurementPlanView: React.FC<ProcurementPlanViewProps> = ({ open, onClose, plan }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleNavigate = (path: string, requiresCommittee: boolean = false) => {
    if (requiresCommittee && !plan.committee_id) {
      toast({
        title: "Committee Required",
        description: "Please form a committee first before accessing this section.",
        variant: "destructive",
      });
      navigate(`/committee/create?procurement_plan_id=${plan.id}`);
      return;
    }
    onClose();
    navigate(path);
  };

  const projectSections = [
    {
      title: "Committee",
      icon: plan.committee_id ? Users : UserPlus,
      status: plan.committee_id ? "View Committee" : "Formation Required",
      statusColor: plan.committee_id ? "text-green-600" : "text-yellow-600",
      path: plan.committee_id ? `/committee/${plan.committee_id}` : `/committee/create?procurement_plan_id=${plan.id}`,
      requiresCommittee: false
    },
    {
      title: "Specification",
      icon: FileText,
      status: "Draft",
      statusColor: "text-blue-600",
      path: `/specification/${plan.id}`,
      requiresCommittee: true
    },
    {
      title: "Review",
      icon: Search,
      status: "Not Started",
      statusColor: "text-gray-600",
      path: `/review/${plan.id}`,
      requiresCommittee: true
    },
    {
      title: "Tender",
      icon: Building2,
      status: "Not Created",
      statusColor: "text-gray-600",
      path: `/tender/${plan.id}`,
      requiresCommittee: true
    },
    {
      title: "Evaluation",
      icon: FileCheck,
      status: "Pending",
      statusColor: "text-gray-600",
      path: `/evaluation/${plan.id}`,
      requiresCommittee: true
    },
    {
      title: "Complaints",
      icon: MessageSquare,
      status: "No Complaints",
      statusColor: "text-green-600",
      path: `/complaints/${plan.id}`,
      requiresCommittee: true
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Procurement Plan Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Timeline Indicator */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Clock className="h-4 w-4" />
              <span>Project Timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">Planning Phase</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className={plan.committee_id ? "text-green-600 font-medium" : "text-gray-400"}>
                {plan.committee_id ? "Committee Formed" : "Committee Formation"}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Specification</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Tender</span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Policy Number</h3>
                <p className="text-gray-700">{plan.policy_number}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Department</h3>
                <p className="text-gray-700">{plan.department}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Project Name</h3>
                <p className="text-gray-700">{plan.project_name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Created At</h3>
                <p className="text-gray-700">{format(new Date(plan.created_at), 'PPP')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Estimated Cost</h3>
                <p className="text-gray-700">NPR {formatCurrency(plan.estimated_cost)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Proposed Budget</h3>
                <p className="text-gray-700">NPR {formatCurrency(plan.proposed_budget)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Budget Percentage</h3>
                <p className="text-gray-700">{plan.proposed_budget_percentage}%</p>
              </div>
            </div>
          </div>

          {/* Project Sections Quick Access */}
          <div>
            <h3 className="font-semibold mb-4">Project Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectSections.map((section) => (
                <button
                  key={section.title}
                  onClick={() => handleNavigate(section.path, section.requiresCommittee)}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5 text-gray-500" />
                    <div className="text-left">
                      <h4 className="font-medium">{section.title}</h4>
                      <p className={`text-sm ${section.statusColor}`}>{section.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Important Alerts */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h4 className="font-medium">
                  {!plan.committee_id 
                    ? "Committee Formation Required"
                    : "Upcoming Deadline"}
                </h4>
                <p className="text-sm">
                  {!plan.committee_id 
                    ? "Please form a committee to proceed with other sections"
                    : "Committee formation deadline in 5 days"}
                </p>
              </div>
            </div>
          </div>

          {/* Quarterly Targets */}
          <div>
            <h3 className="font-semibold mb-4">Quarterly Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plan.quarterly_targets.map((target) => (
                <div key={target.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{target.quarter}</h4>
                  <p className="text-sm text-gray-600 mb-2">{target.target_details || "No details provided"}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    target.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    target.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {target.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementPlanView;
