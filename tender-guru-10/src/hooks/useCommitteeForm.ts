
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMockDb } from "@/hooks/useMockDb";
import type { Committee, CommitteeMember } from "@/types/committee";
import { mockEmployees } from "@/mock/employeeData";

export const useCommitteeForm = (onClose: () => void, onCreateCommittee?: (committee: Committee) => void) => {
  const { toast } = useToast();
  const { create: createCommittee } = useMockDb<Committee>('committees');
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [formDate, setFormDate] = useState("");
  const [specificationDate, setSpecificationDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleAddMember = () => {
    const existingEmployeeIds = new Set(members.map(m => m.employeeId));
    const availableEmployee = mockEmployees.find(emp => !existingEmployeeIds.has(emp.employeeId));

    if (!availableEmployee) {
      toast({
        title: "Cannot Add Member",
        description: "All available employees have been added to the committee",
        variant: "destructive"
      });
      return;
    }

    const newMember: CommitteeMember = {
      id: Date.now(),
      employeeId: availableEmployee.employeeId,
      name: availableEmployee.name,
      email: availableEmployee.email,
      phone: availableEmployee.phone,
      role: "member",
      department: availableEmployee.department,
      tasks: [],
    };
    
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

  const handleUpdateMember = (index: number, field: keyof CommitteeMember, value: string) => {
    setMembers(prevMembers => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };

      if (field === 'employeeId') {
        const employee = mockEmployees.find(emp => emp.employeeId === value);
        if (employee) {
          updatedMembers[index] = {
            ...updatedMembers[index],
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            department: employee.department,
          };
        }
      }

      return updatedMembers;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const committee: Omit<Committee, 'id'> = {
      name,
      purpose,
      formationDate: formDate,
      members: members.map(member => ({
        ...member,
        tasks: []
      })),
      tasks: [],
      specifications: {
        submissionDate: specificationDate,
        documents: [],
        status: 'draft'
      },
      reviews: [],
      approvalStatus: 'draft'
    };

    const createdCommittee = createCommittee(committee);
    
    if (onCreateCommittee) {
      onCreateCommittee(createdCommittee);
    }
    
    toast({
      title: "Committee Created",
      description: "Committee has been formed successfully. Notifications will be sent to members.",
    });
    
    members.forEach(member => {
      console.log(`Mock email sent to ${member.email}`);
      console.log(`Mock SMS sent to ${member.phone}`);
    });
    
    onClose();
  };
  const resetForm = () => {
    // Reset all form fields
    setName('');
    setPurpose('');
    setFormDate('');
    setSpecificationDate(''); 
    setReviewDate('');
    setMembers([]);
    setSelectedFile(null);
  };


  return {
    members,
    formDate,
    specificationDate,
    reviewDate,
    selectedFile,
    name,
    purpose,
    handleAddMember,
    handleUpdateMember,
    handleSubmit,
    setMembers,
    setFormDate,
    setSpecificationDate,
    setReviewDate,
    setSelectedFile,
    setName,
    setPurpose,
    resetForm,
  };
};
