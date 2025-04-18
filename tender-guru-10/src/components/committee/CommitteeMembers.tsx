
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import MemberFormItem from "./MemberFormItem";
import type { CommitteeMember } from "@/types/committee";

interface CommitteeMembersProps {
  members: CommitteeMember[];
  onAddMember: () => void;
  onUpdateMember: (index: number, field: keyof CommitteeMember, value: string) => void;
  onRemoveMember: (index: number) => void;
  disabled?: boolean;
}

const CommitteeMembers = ({
  members,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  disabled = false 
}: CommitteeMembersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">

          <Users className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Committee Members</h3>
        </div>
        <Button
          type="button"
          onClick={onAddMember}
          variant="outline"
          className="flex items-center gap-2"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <MemberFormItem
            key={member.id}
            member={member}
            index={index}
            onUpdate={onUpdateMember}
            onRemove={onRemoveMember}
          />
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No members added yet. Click "Add Member" to begin.
        </div>
      )}
    </div>
  );
};

export default CommitteeMembers;
