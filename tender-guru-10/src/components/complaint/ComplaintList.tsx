
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, FileText } from "lucide-react";
import type { Complaint } from "@/types/complaint";

interface Props {
  complaints: Complaint[];
}

const ComplaintList = ({ complaints }: Props) => {
  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "resolved":
        return "default";
      case "rejected":
        return "destructive";
      case "under_review":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: Complaint["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.title}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(complaint.status)}>
                  {complaint.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(complaint.priority)}>
                  {complaint.priority}
                </Badge>
              </TableCell>
              <TableCell>{complaint.category}</TableCell>
              <TableCell>
                {new Date(complaint.submittedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {complaint.documents.length} files
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {complaint.documents.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintList;
