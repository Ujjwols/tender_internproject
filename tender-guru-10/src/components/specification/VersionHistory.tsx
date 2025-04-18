
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, FileText, GitCompareArrows } from "lucide-react";
import type { DocumentVersion } from "@/types/specification";

interface VersionHistoryProps {
  versions: DocumentVersion[];
  onCompareVersions: (v1: DocumentVersion, v2: DocumentVersion) => void;
  onViewVersion: (version: DocumentVersion) => void;
}

const VersionHistory = ({ versions, onCompareVersions, onViewVersion }: VersionHistoryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Version History</h3>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {versions.map((version, index) => (
          <div
            key={version.id}
            className="mb-4 p-4 bg-gray-50 rounded-lg border last:mb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Version {version.version}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewVersion(version)}
                >
                  View
                </Button>
                {index < versions.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCompareVersions(version, versions[index + 1])}
                  >
                    <GitCompareArrows className="h-4 w-4 mr-1" />
                    Compare
                  </Button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Changes: {version.changes}</p>
              <p>
                Submitted by: {version.submittedBy} on{" "}
                {new Date(version.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default VersionHistory;
