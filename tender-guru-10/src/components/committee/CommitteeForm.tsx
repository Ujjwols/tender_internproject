import FormContainer from "./form/FormContainer";
import FormHeader from "./form/FormHeader";
import FormActions from "./form/FormActions";
import BasicInfoFields from "./BasicInfoFields";
import DateInputs from "./DateInputs";
import CommitteeMembers from "./CommitteeMembers";
import FileUpload from "./FileUpload";
import { useCommitteeForm } from "@/hooks/useCommitteeForm";
import type { Committee } from "@/types/committee";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CommitteeFormProps {
  onClose: () => void;
  onCreateCommittee?: (committee: Committee) => void;
  committeeId?: string;
}

const CommitteeForm = ({ onClose, onCreateCommittee, committeeId }: CommitteeFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNotify, setShouldNotify] = useState(true);
  
  const {
    members,
    formDate,
    specificationDate,
    reviewDate,
    selectedFile,
    name,
    purpose,
    handleAddMember,
    handleUpdateMember,
    setMembers,
    setFormDate,
    setSpecificationDate,
    setReviewDate,
    setSelectedFile,
    setName,
    setPurpose,
    resetForm
  } = useCommitteeForm(onClose, onCreateCommittee);

  useEffect(() => {
    const fetchCommittee = async () => {
      if (!committeeId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/v1/committees/${committeeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch committee');
        
        const { data } = await response.json();
        
        setName(data.name);
        setPurpose(data.purpose);
        setFormDate(data.formationDate);
        setSpecificationDate(data.specificationSubmissionDate || '');
        setReviewDate(data.reviewDate || '');
        setMembers(data.members || []);
        
        if (data.formationLetter) {
          try {
            const fileResponse = await fetch(`http://localhost:5000/api/v1/committees/${committeeId}/download`);
            const blob = await fileResponse.blob();
            const file = new File([blob], data.formationLetter.originalname, {
              type: data.formationLetter.mimetype,
              lastModified: new Date().getTime()
            });
            setSelectedFile(file);
          } catch (error) {
            console.error('Error fetching file:', error);
            const mockFile = new File([], data.formationLetter.originalname, {
              type: data.formationLetter.mimetype
            });
            Object.defineProperty(mockFile, 'size', { value: data.formationLetter.size });
            setSelectedFile(mockFile);
          }
        }
      } catch (error) {
        console.error('Error fetching committee:', error);
        toast({
          title: "Error",
          description: "Failed to load committee data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommittee();
  }, [committeeId, toast, setName, setPurpose, setFormDate, setSpecificationDate, setReviewDate, setMembers, setSelectedFile]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalidMembers = members.filter(m => 
      !m.employeeId || 
      typeof m.employeeId !== 'string' || 
      m.employeeId.trim() === ''
    );

    if (invalidMembers.length > 0) {
      toast({
        title: "Validation Error",
        description: `The following members have invalid IDs: ${
          invalidMembers.map((_, i) => i + 1).join(', ')
        }`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('purpose', purpose);
      formData.append('formationDate', formDate);
      formData.append('specificationSubmissionDate', specificationDate || '');
      formData.append('reviewDate', reviewDate || '');
      
      const memberIds = members.map(m => m.employeeId.trim());
      formData.append('members', JSON.stringify(memberIds));
      
      formData.append('shouldNotify', shouldNotify.toString());
      
      if (selectedFile) {
        formData.append('formationLetter', selectedFile);
      }
      
      const endpoint = committeeId 
        ? `http://localhost:5000/api/v1/committees/${committeeId}`
        : 'http://localhost:5000/api/v1/committees/createcommittees';
      const method = committeeId ? 'PATCH' : 'POST';
      
      console.log('Submitting:', {
        name,
        purpose,
        members: memberIds,
        hasFile: !!selectedFile,
        shouldNotify
      });
      
      const response = await fetch(endpoint, {
        method,
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 
                           errorData.error?.message || 
                           `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const { data } = await response.json();
      
      toast({
        title: "Success",
        description: committeeId 
          ? "Committee updated successfully" 
          : "Committee created successfully",
      });
      
      if (onCreateCommittee) {
        onCreateCommittee(data.committee);
      }
      
      if (!committeeId) {
        resetForm();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving committee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save committee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (index: number) => {
    try {
      if (committeeId && members[index]?.employeeId) {
        const response = await fetch(
          `http://localhost:5000/api/v1/committees/${committeeId}/members/${members[index].employeeId}`, 
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          }
        );
        
        if (!response.ok) throw new Error('Failed to remove member');
        
        const result = await response.json();
        
        if (result.success) {
          setMembers(members.filter((_, i) => i !== index));
          toast({
            title: "Member Removed",
            description: "Committee member has been removed successfully.",
          });
        }
      } else {
        setMembers(members.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove committee member",
        variant: "destructive",
      });
    }
  };

  const downloadFormationLetter = async () => {
    if (!committeeId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/committees/${committeeId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formation-letter-${committeeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download formation letter",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full slide-in fade-in">
      <FormHeader onClose={onClose} />

      <form onSubmit={handleFormSubmit} className="space-y-8 mt-6">
        <div className="space-y-6">
          <BasicInfoFields
            name={name}
            purpose={purpose}
            onNameChange={setName}
            onPurposeChange={setPurpose}
            disabled={isLoading}
          />

          <DateInputs
            formDate={formDate}
            specificationDate={specificationDate}
            reviewDate={reviewDate}
            onFormDateChange={setFormDate}
            onSpecificationDateChange={setSpecificationDate}
            onReviewDateChange={setReviewDate}
            disabled={isLoading}
          />

          <CommitteeMembers
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onRemoveMember={handleRemoveMember}
            disabled={isLoading}
          />

          <FileUpload 
            onFileChange={setSelectedFile} 
            existingFile={committeeId && selectedFile ? {
              name: selectedFile.name,
              size: selectedFile.size,
              onDownload: downloadFormationLetter
            } : undefined}
            disabled={isLoading}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="shouldNotify"
              checked={shouldNotify}
              onChange={(e) => setShouldNotify(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="shouldNotify" className="text-sm text-gray-700">
              Send email notifications to committee members
            </label>
          </div>
        </div>

        <FormActions 
          onClose={onClose} 
          isLoading={isLoading}
          isEditMode={!!committeeId}
        />
      </form>
    </div>
  );
};

export default CommitteeForm;