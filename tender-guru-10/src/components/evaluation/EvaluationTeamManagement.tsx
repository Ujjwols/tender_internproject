
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EvaluationTeam, EvaluationTeamMember, EvaluationTeamRole } from "@/types/evaluation";
import AddMemberForm from "./team/AddMemberForm";
import MemberList from "./team/MemberList";
import OTPVerification from "./team/OTPVerification";

interface Props {
  team: EvaluationTeam;
  onTeamUpdate: (team: EvaluationTeam) => void;
}

const EvaluationTeamManagement = ({ team, onTeamUpdate }: Props) => {
  const { toast } = useToast();
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [selectedMember, setSelectedMember] = useState<EvaluationTeamMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: EvaluationTeamRole;
    department: string;
  }>({
    name: "",
    email: "",
    role: "member",
    department: "",
  });

  const handleGenerateOTP = async (member: EvaluationTeamMember) => {
    const mockOTP = Math.random().toString(36).slice(-6);
    setSelectedMember({ 
      ...member, 
      otp: mockOTP, 
      otpValidUntil: new Date(Date.now() + 30 * 60000).toISOString() 
    });
    setShowOTPInput(true);
    
    toast({
      title: "OTP Generated",
      description: `An OTP has been sent to ${member.email}`,
    });
  };

  const handleVerifyOTP = (value: string) => {
    if (selectedMember?.otp === value) {
      const updatedTeam = {
        ...team,
        members: team.members.map(m => 
          m.id === selectedMember.id ? { ...m, hasAccess: true } : m
        )
      };
      onTeamUpdate(updatedTeam);
      
      toast({
        title: "Access Granted",
        description: "Team member can now access evaluation documents",
      });
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please try again",
        variant: "destructive",
      });
    }
    setShowOTPInput(false);
    setSelectedMember(null);
  };

  const handleNewMemberChange = (field: string, value: string) => {
    setNewMember(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedTeam = {
      ...team,
      members: [
        ...team.members,
        {
          id: Date.now(),
          ...newMember,
          hasAccess: false,
        },
      ],
    };

    onTeamUpdate(updatedTeam);
    setShowAddMember(false);
    setNewMember({
      name: "",
      email: "",
      role: "member",
      department: "",
    });

    toast({
      title: "Member Added",
      description: "New team member has been added successfully",
    });
  };

  const handleSendInstructions = (member: EvaluationTeamMember) => {
    toast({
      title: "Access Instructions Sent",
      description: `Instructions have been sent to ${member.email}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-500">
            Created on {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {showAddMember && (
        <AddMemberForm
          newMember={newMember}
          onNewMemberChange={handleNewMemberChange}
          onCancel={() => setShowAddMember(false)}
          onAdd={handleAddMember}
        />
      )}

      <MemberList
        members={team.members}
        onGenerateOTP={handleGenerateOTP}
        onSendInstructions={handleSendInstructions}
      />

      {showOTPInput && selectedMember && (
        <OTPVerification
          memberEmail={selectedMember.email}
          onComplete={handleVerifyOTP}
        />
      )}
    </div>
  );
};

export default EvaluationTeamManagement;
