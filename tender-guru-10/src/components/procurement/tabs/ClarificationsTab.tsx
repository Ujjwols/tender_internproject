
import ClarificationManager from "../ClarificationManager";
import type { Clarification } from "@/types/procurement";

interface ClarificationsTabProps {
  tenderId: number;
  clarifications: Clarification[];
  onUpdate: (clarifications: Clarification[]) => void;
}

const ClarificationsTab = ({ tenderId, clarifications, onUpdate }: ClarificationsTabProps) => {
  return (
    <ClarificationManager
      tenderId={tenderId}
      clarifications={clarifications}
      onUpdate={onUpdate}
    />
  );
};

export default ClarificationsTab;

