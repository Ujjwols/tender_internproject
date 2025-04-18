
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { PreBidMeeting } from "@/types/procurement";

interface PreBidMeetingManagerProps {
  tenderId: number;
  meetings: PreBidMeeting[];
  onUpdate: (meetings: PreBidMeeting[]) => void;
}

const PreBidMeetingManager = ({
  tenderId,
  meetings,
  onUpdate,
}: PreBidMeetingManagerProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    scheduledDate: "",
    venue: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting: PreBidMeeting = {
      id: Date.now(),
      tenderId,
      scheduledDate: formData.scheduledDate,
      venue: formData.venue,
      attendees: [],
      status: "scheduled",
    };

    onUpdate([...meetings, newMeeting]);
    setFormData({
      scheduledDate: "",
      venue: "",
    });

    toast({
      title: "Pre-Bid Meeting Scheduled",
      description: "New pre-bid meeting has been successfully scheduled.",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              required
            />
          </div>
        </div>

        <Button type="submit">Schedule Meeting</Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Scheduled Meetings</h3>
        {meetings.length === 0 ? (
          <p className="text-gray-500">No meetings scheduled yet.</p>
        ) : (
          <div className="space-y-2">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    Date: {new Date(meeting.scheduledDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Venue: {meeting.venue}</p>
                  <p className="text-sm text-gray-500">
                    Status: {meeting.status.toUpperCase()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const updated = meetings.map((m) =>
                      m.id === meeting.id
                        ? { ...m, status: "completed" as const }
                        : m
                    );
                    onUpdate(updated);
                    toast({
                      title: "Meeting Completed",
                      description: "Pre-bid meeting has been marked as completed.",
                    });
                  }}
                  disabled={meeting.status !== "scheduled"}
                >
                  {meeting.status === "scheduled" ? "Mark as Completed" : "Completed"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreBidMeetingManager;
