
import PreBidMeetingManager from "../PreBidMeetingManager";
import type { PreBidMeeting } from "@/types/procurement";

interface PreBidMeetingsTabProps {
  tenderId: number;
  meetings: PreBidMeeting[];
  onUpdate: (meetings: PreBidMeeting[]) => void;
}

const PreBidMeetingsTab = ({ tenderId, meetings, onUpdate }: PreBidMeetingsTabProps) => {
  return (
    <PreBidMeetingManager
      tenderId={tenderId}
      meetings={meetings}
      onUpdate={onUpdate}
    />
  );
};

export default PreBidMeetingsTab;

