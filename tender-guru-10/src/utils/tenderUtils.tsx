
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TenderStatus, TenderApprovalStatus, Tender } from "@/types/tender";

export const getStatusBadge = (status: TenderStatus): React.ReactElement => {
  const statusStyles = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status}
    </Badge>
  );
};

export const getApprovalStatusBadge = (status: TenderApprovalStatus): React.ReactElement => {
  const statusStyles = {
    pending: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status}
    </Badge>
  );
};

export const canTransitionStatus = (
  currentStatus: TenderStatus,
  targetStatus: TenderStatus,
  approvalStatus: TenderApprovalStatus
): boolean => {
  switch (currentStatus) {
    case "draft":
      return targetStatus === "published" && approvalStatus === "approved";
    case "published":
      return targetStatus === "closed";
    default:
      return false;
  }
};

export const getNextStatus = (currentStatus: TenderStatus): TenderStatus | null => {
  const transitions: Record<TenderStatus, TenderStatus | null> = {
    draft: "published",
    published: "closed",
    closed: null,
  };
  return transitions[currentStatus];
};
