
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processEmployeeFile, convertToEmployee } from "@/utils/employeeImport";
import type { Employee } from "@/types/employee";

interface ImportButtonProps {
  onImport: (employee: Omit<Employee, 'id'>) => void;
}

const ImportButton = ({ onImport }: ImportButtonProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonData = await processEmployeeFile(file);
      let successCount = 0;
      let errorCount = 0;

      for (const row of jsonData) {
        try {
          const employee = convertToEmployee(row);

          if (!employee.employeeId || !employee.name || !employee.email) {
            errorCount++;
            continue;
          }

          onImport(employee);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      toast({
        title: "Bulk Import Complete",
        description: `Successfully imported ${successCount} employees. ${errorCount} entries had errors.`
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to process the file. Please check the format.",
        variant: "destructive"
      });
    }

    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
      />
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleImportClick}
      >
        <Upload className="h-4 w-4" />
        Import Excel/CSV
      </Button>
    </>
  );
};

export default ImportButton;
