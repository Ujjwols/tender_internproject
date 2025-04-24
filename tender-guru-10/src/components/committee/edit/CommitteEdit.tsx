import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Committee, CommitteeMember } from "@/types/committee";

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  department: string;
}

const CommitteeUpdate = () => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const navigate = useNavigate();
  const { hasPermission, token, employees } = useAuth();
  const { toast } = useToast();

  const [committee, setCommittee] = useState<Committee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    formationDate: "",
    specificationSubmissionDate: "",
    reviewDate: "",
    schedule: "",
    members: [] as string[],
    formationLetter: null as File | null,
    shouldNotify: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hasPermission("manage_committees")) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit committees.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const fetchCommittee = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/committees/getcommitteebyid/${committeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch committee");
        }

        const data = await response.json();
        const committeeData = data.data.committee;

        setCommittee(committeeData);
        setFormData({
          name: committeeData.name,
          purpose: committeeData.purpose,
          formationDate: new Date(committeeData.formationDate)
            .toISOString()
            .split("T")[0],
          specificationSubmissionDate: committeeData.specificationSubmissionDate
            ? new Date(committeeData.specificationSubmissionDate)
                .toISOString()
                .split("T")[0]
            : "",
          reviewDate: committeeData.reviewDate
            ? new Date(committeeData.reviewDate).toISOString().split("T")[0]
            : "",
          schedule: committeeData.schedule || "",
          members: committeeData.members.map((m: CommitteeMember) => m.employeeId),
          formationLetter: null,
          shouldNotify: false,
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load committee",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (committeeId && token) {
      fetchCommittee();
    }
  }, [committeeId, token, hasPermission, navigate, toast]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, formationLetter: file }));
  };

  const handleMemberToggle = (employeeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      members: checked
        ? [...prev.members, employeeId]
        : prev.members.filter((id) => id !== employeeId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!committeeId) return;

    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("purpose", formData.purpose);
    formDataToSend.append("formationDate", formData.formationDate);
    if (formData.specificationSubmissionDate) {
      formDataToSend.append(
        "specificationSubmissionDate",
        formData.specificationSubmissionDate
      );
    }
    if (formData.reviewDate) {
      formDataToSend.append("reviewDate", formData.reviewDate);
    }
    if (formData.schedule) {
      formDataToSend.append("schedule", formData.schedule);
    }
    formDataToSend.append("members", JSON.stringify(formData.members));
    formDataToSend.append("shouldNotify", String(formData.shouldNotify));
    if (formData.formationLetter) {
      formDataToSend.append("formationLetter", formData.formationLetter);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/committees/updatecommittees/${committeeId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update committee");
      }

      toast({
        title: "Update Successful",
        description: "Committee has been updated.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update committee",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !committee) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Committee</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Committee Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formationDate">Formation Date</Label>
            <Input
              id="formationDate"
              name="formationDate"
              type="date"
              value={formData.formationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specificationSubmissionDate">
              Specification Submission Date
            </Label>
            <Input
              id="specificationSubmissionDate"
              name="specificationSubmissionDate"
              type="date"
              value={formData.specificationSubmissionDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewDate">Review Date</Label>
            <Input
              id="reviewDate"
              name="reviewDate"
              type="date"
              value={formData.reviewDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Members</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-2">
              {employees.map((emp: Employee) => (
                <div key={emp._id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`member-${emp._id}`}
                    checked={formData.members.includes(emp.employeeId)}
                    onCheckedChange={(checked: boolean) =>
                      handleMemberToggle(emp.employeeId, checked)
                    }
                  />
                  <Label htmlFor={`member-${emp._id}`}>
                    {emp.name} ({emp.employeeId} - {emp.department})
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="formationLetter">Formation Letter</Label>
            <Input
              id="formationLetter"
              name="formationLetter"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {committee.formationLetter && (
              <p className="text-sm text-gray-600">
                Current file: {committee.formationLetter.originalname}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shouldNotify"
              checked={formData.shouldNotify}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  shouldNotify: checked,
                }))
              }
            />
            <Label htmlFor="shouldNotify">Notify Members</Label>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/committees")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommitteeUpdate;