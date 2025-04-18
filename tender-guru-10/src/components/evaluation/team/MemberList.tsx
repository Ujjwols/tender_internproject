
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Key, Mail } from "lucide-react";
import type { EvaluationTeamMember } from "@/types/evaluation";

interface MemberListProps {
  members: EvaluationTeamMember[];
  onGenerateOTP: (member: EvaluationTeamMember) => void;
  onSendInstructions: (member: EvaluationTeamMember) => void;
}

const MemberList = ({ members, onGenerateOTP, onSendInstructions }: MemberListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Access Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {member.role}
              </Badge>
            </TableCell>
            <TableCell>{member.department}</TableCell>
            <TableCell>
              <Badge variant={member.hasAccess ? "secondary" : "outline"}>
                {member.hasAccess ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateOTP(member)}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Generate OTP
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendInstructions(member)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Instructions
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MemberList;
