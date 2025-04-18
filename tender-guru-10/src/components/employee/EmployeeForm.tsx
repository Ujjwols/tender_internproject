
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import type { Employee } from "@/types/employee";

interface EmployeeFormProps {
  employee: Omit<Employee, 'id'>;
  onChange: (name: keyof Omit<Employee, 'id'>, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EmployeeForm = ({ employee, onChange, onSubmit, onCancel }: EmployeeFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof Omit<Employee, 'id'>, value);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Add New Employee</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={employee.employeeId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={employee.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={employee.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={employee.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={employee.department}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              value={employee.designation}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="dateJoined">Date Joined</Label>
            <Input
              id="dateJoined"
              name="dateJoined"
              type="date"
              value={employee.dateJoined}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Employee</Button>
        </div>
      </form>
    </Card>
  );
};

export default EmployeeForm;

