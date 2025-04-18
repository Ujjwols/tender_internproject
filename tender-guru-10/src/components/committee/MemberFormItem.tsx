import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CommitteeMember } from "@/types/committee";
import type { Employee } from "@/types/employee";
import { useEffect, useRef, useState } from "react";

interface MemberFormItemProps {
  member: CommitteeMember;
  index: number;
  onUpdate: (index: number, field: keyof CommitteeMember, value: string) => void;
  onRemove: (index: number) => void;
}

const MemberFormItem = ({ member, index, onUpdate, onRemove }: MemberFormItemProps) => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const previousId = useRef<string>("");

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const stringValue = value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
    
    onUpdate(index, 'employeeId', stringValue);

    // Clear previous data if ID is being changed
    if (previousId.current && previousId.current !== stringValue) {
      onUpdate(index, 'name', '');
      onUpdate(index, 'email', '');
      onUpdate(index, 'phone', '');
      onUpdate(index, 'department', '');
    }

    // Validate only if we have exactly 6 characters
    if (stringValue.length === 6) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchEmployeeData(stringValue);
      }, 500); // 500ms debounce
    } else if (stringValue.length > 0 && stringValue.length !== 6) {
      toast({
        title: "Invalid ID Format",
        description: "Employee ID must be exactly 6 characters",
        variant: "destructive",
      });
    }

    previousId.current = stringValue;
  };

  const fetchEmployeeData = async (employeeId: string) => {
    try {
      setIsValidating(true);
      
      const response = await fetch(`http://localhost:5000/api/v1/auth/employee/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Employee not found');
      }

      const { data: { user } } = await response.json();

      // Update all fields at once
      onUpdate(index, 'name', String(user.name));
      onUpdate(index, 'email', String(user.email));
      onUpdate(index, 'phone', String(user.phoneNumber || ''));
      onUpdate(index, 'department', String(user.department || ''));
      
      toast({
        title: "Employee Data Loaded",
        description: `${user.name}'s information has been auto-filled`,
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast({
        title: "Employee Not Found",
        description: `No record found for ID: ${employeeId}`,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
      <div>
        <Label htmlFor={`employee-id-${index}`}>Employee ID *</Label>
        <Input
          id={`employee-id-${index}`}
          value={String(member.employeeId || '')}
          onChange={handleEmployeeIdChange}
          placeholder="Enter 6-digit ID"
          required
          maxLength={6}
          disabled={isValidating}
        />
      </div>

      <div>
        <Label htmlFor={`name-${index}`}>Name *</Label>
        <Input
          id={`name-${index}`}
          value={String(member.name || '')}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          placeholder="Full name"
          required
          disabled={isValidating}
        />
      </div>

      <div>
        <Label htmlFor={`role-${index}`}>Role *</Label>
        <select
          id={`role-${index}`}
          value={member.role || 'member'}
          onChange={(e) => onUpdate(index, 'role', e.target.value)}
          className="w-full h-10 px-3 py-2 text-base rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
          disabled={isValidating}
        >
          <option value="member">Member</option>
          <option value="chairperson">Chairperson</option>
          <option value="secretary">Secretary</option>
        </select>
      </div>

      <div>
        <Label htmlFor={`email-${index}`}>Email *</Label>
        <Input
          id={`email-${index}`}
          type="email"
          value={String(member.email || '')}
          onChange={(e) => onUpdate(index, 'email', e.target.value)}
          placeholder="email@example.com"
          required
          disabled={isValidating}
        />
      </div>

      <div>
        <Label htmlFor={`phone-${index}`}>Phone</Label>
        <Input
          id={`phone-${index}`}
          type="tel"
          value={String(member.phone || '')}
          onChange={(e) => onUpdate(index, 'phone', e.target.value)}
          placeholder="Phone number"
          disabled={isValidating}
        />
      </div>

      <div>
        <Label htmlFor={`department-${index}`}>Department</Label>
        <Input
          id={`department-${index}`}
          value={String(member.department || '')}
          onChange={(e) => onUpdate(index, 'department', e.target.value)}
          placeholder="Department"
          disabled={isValidating}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute -right-2 -top-2"
        onClick={() => onRemove(index)}
        disabled={isValidating}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MemberFormItem;