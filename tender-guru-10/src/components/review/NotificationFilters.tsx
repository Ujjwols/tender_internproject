
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NotificationFiltersProps {
  currentFilter: 'all' | 'status_change' | 'deadline' | 'email';
  onFilterChange: (filter: 'all' | 'status_change' | 'deadline' | 'email') => void;
  onClearAll: () => void;
}

export const NotificationFilters = ({
  currentFilter,
  onFilterChange,
  onClearAll,
}: NotificationFiltersProps) => {
  return (
    <div className="p-2 flex items-center justify-between border-b">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange('all')}
          className={currentFilter === 'all' ? 'bg-gray-100' : ''}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange('status_change')}
          className={currentFilter === 'status_change' ? 'bg-purple-100' : ''}
        >
          Status
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange('deadline')}
          className={currentFilter === 'deadline' ? 'bg-orange-100' : ''}
        >
          Deadlines
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange('email')}
          className={currentFilter === 'email' ? 'bg-blue-100' : ''}
        >
          Emails
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
