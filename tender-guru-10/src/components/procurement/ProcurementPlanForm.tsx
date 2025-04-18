import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProcurementPlan, QuarterlyTarget } from "@/types/procurement-plan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcurementPlanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<ProcurementPlan, 'id'>) => void;
}

type FormQuarterlyTarget = {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  target_details: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  created_at: string;
};

const INITIAL_QUARTERLY_TARGETS: FormQuarterlyTarget[] = [
  { quarter: 'Q1', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
  { quarter: 'Q2', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
  { quarter: 'Q3', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
  { quarter: 'Q4', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
];

const ProcurementPlanForm: React.FC<ProcurementPlanFormProps> = ({ open, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    policy_number: '',
    department: 'Wireline',
    project_name: '',
    project_description: '',
    estimated_cost: 0,
    proposed_budget: 0,
    quarterly_targets: INITIAL_QUARTERLY_TARGETS
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name.includes('budget') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.policy_number || !formData.project_name || !formData.project_description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const proposedBudgetPercentage = (formData.proposed_budget / formData.estimated_cost) * 100;

    // Generate temporary IDs for the quarterly targets
    const tempId = Date.now();
    const quarterlyTargets: QuarterlyTarget[] = formData.quarterly_targets.map((target, index) => ({
      ...target,
      id: tempId + index,
      procurement_plan_id: tempId
    }));

    const newPlan: Omit<ProcurementPlan, 'id'> = {
      policy_number: formData.policy_number,
      department: formData.department,
      project_name: formData.project_name,
      project_description: formData.project_description,
      estimated_cost: formData.estimated_cost,
      proposed_budget: formData.proposed_budget,
      proposed_budget_percentage: Math.round(proposedBudgetPercentage),
      created_at: new Date().toISOString(),
      quarterly_targets: quarterlyTargets
    };

    onSubmit(newPlan);
    onClose();
    setFormData({
      policy_number: '',
      department: 'Wireline',
      project_name: '',
      project_description: '',
      estimated_cost: 0,
      proposed_budget: 0,
      quarterly_targets: INITIAL_QUARTERLY_TARGETS
    });
  };

  const handleQuarterlyTargetChange = (quarter: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      quarterly_targets: prev.quarterly_targets.map(target => 
        target.quarter === quarter ? { ...target, target_details: value } : target
      )
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Procurement Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="policy_number">Policy Number*</Label>
                <Input
                  id="policy_number"
                  name="policy_number"
                  value={formData.policy_number}
                  onChange={handleChange}
                  placeholder="PP-2080-WL-N-XX"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="project_name">Project Name*</Label>
                <Input
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="department">Department*</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wireline">Wireline</SelectItem>
                    <SelectItem value="Wireless">Wireless</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="estimated_cost">Estimated Cost (NPR)*</Label>
                <Input
                  id="estimated_cost"
                  name="estimated_cost"
                  type="number"
                  value={formData.estimated_cost}
                  onChange={handleChange}
                  min="0"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="proposed_budget">Proposed Budget (NPR)*</Label>
                <Input
                  id="proposed_budget"
                  name="proposed_budget"
                  type="number"
                  value={formData.proposed_budget}
                  onChange={handleChange}
                  min="0"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="project_description">Project Description*</Label>
                <Textarea
                  id="project_description"
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  required
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Label className="text-lg font-semibold">Quarterly Targets</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {formData.quarterly_targets.map((target) => (
                <div key={target.quarter} className="space-y-2">
                  <Label htmlFor={`target_${target.quarter}`}>{target.quarter} Target Details</Label>
                  <Input
                    id={`target_${target.quarter}`}
                    value={target.target_details}
                    onChange={(e) => handleQuarterlyTargetChange(target.quarter, e.target.value)}
                    placeholder={`Enter ${target.quarter} target details`}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementPlanForm;
