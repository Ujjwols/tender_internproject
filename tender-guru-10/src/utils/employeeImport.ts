
import * as XLSX from 'xlsx';
import type { Employee } from "@/types/employee";

export interface ExcelEmployeeRow {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  dateJoined: string;
}

export const processEmployeeFile = async (file: File): Promise<Partial<ExcelEmployeeRow>[]> => {
  const data = await file.arrayBuffer();
  let jsonData: Partial<ExcelEmployeeRow>[] = [];

  if (file.name.endsWith('.csv')) {
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(worksheet);
  } else {
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(worksheet);
  }

  return jsonData;
};

export const convertToEmployee = (row: Partial<ExcelEmployeeRow>): Omit<Employee, 'id'> => {
  return {
    employeeId: String(row.employeeId || ''),
    name: String(row.name || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    department: String(row.department || ''),
    designation: String(row.designation || ''),
    dateJoined: String(row.dateJoined || new Date().toISOString().split('T')[0]),
    isActive: true
  };
};
