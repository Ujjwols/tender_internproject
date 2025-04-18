import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Loader2, Edit, Trash2 } from "lucide-react";
import { exportToCSV } from "@/utils/exportUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type SortField = 'employeeId' | 'name' | 'department' | 'designation';
type SortOrder = 'asc' | 'desc';

const EmployeeList = () => {
  const { 
    employees = [], 
    employeesLoading, 
    employeesError, 
    refetchEmployees,
    token,
    hasPermission,
    deleteUser,
  } = useAuth();
  
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: 'employeeId',
    order: 'asc',
  });

  useEffect(() => {
    if (token) {
      refetchEmployees();
    }
  }, [token]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const valueA = a[sortConfig.field]?.toString().toLowerCase() || '';
    const valueB = b[sortConfig.field]?.toString().toLowerCase() || '';
    
    if (sortConfig.order === 'asc') {
      return valueA.localeCompare(valueB);
    }
    return valueB.localeCompare(valueA);
  });

  const handleExport = () => {
    exportToCSV(
      employees.map(emp => ({
        'Employee ID': emp.employeeId,
        'Name': emp.name,
        'Department': emp.department,
        'Designation': emp.designation,
        'Email': emp.email,
        'Phone Number': emp.phoneNumber,
        'Status': emp.isActive ? 'Active' : 'Inactive',
      })),
      'employee-list'
    );
  };

  const handleUpdate = (employeeId: string) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDelete = async (employeeId: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteUser(employeeId);
    }
  };

  if (employeesLoading && employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading employees...</span>
      </div>
    );
  }

  if (employeesError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <p>Error loading employees</p>
          <p className="text-sm text-gray-600">{employeesError}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={refetchEmployees}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Directory</h2>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('employeeId')}
              >
                <div className="flex items-center">
                  Employee ID
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center">
                  Department
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('designation')}
              >
                <div className="flex items-center">
                  Designation
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead>Status</TableHead>
              {hasPermission('manage_users') && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map(employee => (
                <TableRow key={employee._id}>
                  <TableCell className="font-medium">{employee.employeeId}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        employee.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  {hasPermission('manage_users') && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdate(employee._id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(employee._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={hasPermission('manage_users') ? 7 : 6} className="text-center py-8 text-gray-500">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default EmployeeList;