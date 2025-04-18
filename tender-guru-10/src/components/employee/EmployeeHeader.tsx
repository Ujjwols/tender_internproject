
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImportButton from "./ImportButton";
import type { Employee } from "@/types/employee";

interface EmployeeHeaderProps {
  onAddClick: () => void;
  onImport: (employee: Omit<Employee, 'id'>) => void;
}

const EmployeeHeader = ({ onAddClick, onImport }: EmployeeHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Employee Management</h1>
      <div className="flex gap-2">
        <ImportButton onImport={onImport} />
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
    </div>
  );
};

export default EmployeeHeader;
