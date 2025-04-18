
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TenderStatus } from "@/types/tender";

interface TenderSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: TenderStatus | "all";
  setStatusFilter: (status: TenderStatus | "all") => void;
}

const TenderSearchFilter = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: TenderSearchFilterProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search tenders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          className="border rounded p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TenderStatus | "all")}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
};

export default TenderSearchFilter;
