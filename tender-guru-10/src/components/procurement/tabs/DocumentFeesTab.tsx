
import DocumentFeeManager from "../DocumentFeeManager";
import type { DocumentFee } from "@/types/procurement";

interface DocumentFeesTabProps {
  tenderId: number;
  documentFees: DocumentFee[];
  onUpdate: (fees: DocumentFee[]) => void;
}

const DocumentFeesTab = ({ tenderId, documentFees, onUpdate }: DocumentFeesTabProps) => {
  return (
    <DocumentFeeManager
      tenderId={tenderId}
      documentFees={documentFees}
      onUpdate={onUpdate}
    />
  );
};

export default DocumentFeesTab;

