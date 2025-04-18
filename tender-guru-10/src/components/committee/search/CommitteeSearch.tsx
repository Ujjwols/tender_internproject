import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Calendar, Edit, Trash2,Loader2} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Committee } from "@/types/committee";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const CommitteeList = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermission, token } = useAuth();

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/committees/getallcommittee`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch committees");
        }

        const data = await response.json();
        setCommittees(data.data.committees);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load committees",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCommittees();
    }
  }, [toast, token]);

  const handleDelete = async (committeeId: string) => {
    if (window.confirm("Are you sure you want to delete this committee?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/committees/deletecommittee/${committeeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete committee");
        }

        setCommittees((prev) =>
          prev.filter((committee) => committee._id !== committeeId)
        );
        toast({
          title: "Deletion Successful",
          description: "Committee has been deleted.",
        });
      } catch (error) {
        toast({
          title: "Deletion Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete committee",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = (committeeId: string) => {
    navigate(`/committees/edit/${committeeId}`);
  };

  // Extract unique departments from committee members
  const departments = Array.from(
    new Set(
      committees.flatMap((committee) =>
        committee.members.map((member) => member.department)
      )
    )
  ).filter(Boolean) as string[];

  const filteredCommittees = committees.filter((committee) => {
    const matchesSearch =
      committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (committee.approvalStatus
        ? committee.approvalStatus === statusFilter
        : statusFilter === "all");

    const matchesDepartment =
      departmentFilter === "all" ||
      committee.members.some((member) => member.department === departmentFilter);

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading committees...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <p>Error loading committees</p>
          <p className="text-sm text-gray-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search committees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCommittees.map((committee) => (
          <Card key={committee._id} className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate(`/committees/${committee._id}`)}
                >
                  <h3 className="font-semibold">{committee.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      committee.approvalStatus === "approved"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {committee.approvalStatus || "active"}
                  </Badge>
                  {hasPermission("manage_committees") && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate(committee._id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(committee._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{committee.purpose}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Formed: {new Date(committee.formationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {committee.members.map((member, index) => (
                  <Badge
                    key={`${member.employeeId}-${index}`}
                    variant="outline"
                  >
                    {member.name} ({member.department})
                  </Badge>
                ))}
              </div>
              {committee.formationLetter && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">
                    Has Formation Letter
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        ))}
        {filteredCommittees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No committees found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeList;