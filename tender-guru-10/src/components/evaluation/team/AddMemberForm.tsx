
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EvaluationTeamRole } from "@/types/evaluation";

interface AddMemberFormProps {
  newMember: {
    name: string;
    email: string;
    role: EvaluationTeamRole;
    department: string;
  };
  onNewMemberChange: (field: string, value: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddMemberForm = ({ newMember, onNewMemberChange, onCancel, onAdd }: AddMemberFormProps) => {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h4 className="font-medium">Add New Team Member</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newMember.name}
            onChange={(e) => onNewMemberChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newMember.email}
            onChange={(e) => onNewMemberChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            className="w-full p-2 border rounded-md"
            value={newMember.role}
            onChange={(e) => onNewMemberChange("role", e.target.value)}
          >
            <option value="member">Member</option>
            <option value="chair">Chair</option>
            <option value="secretary">Secretary</option>
          </select>
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={newMember.department}
            onChange={(e) => onNewMemberChange("department", e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAdd}>
          Add Member
        </Button>
      </div>
    </div>
  );
};

export default AddMemberForm;
