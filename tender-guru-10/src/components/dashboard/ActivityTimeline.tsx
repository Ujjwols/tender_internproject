
import { Activity, mockActivities } from "@/mock/activityData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const ActivityTimeline = () => {
  const activities = mockActivities;

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'tender':
        return 'bg-blue-500';
      case 'committee':
        return 'bg-green-500';
      case 'vendor':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={cn(
                "w-2 h-2 mt-2 rounded-full",
                getActivityColor(activity.type)
              )} />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.user} {activity.action} a {activity.type}
                </p>
                {activity.details && (
                  <p className="text-sm text-gray-500">{activity.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityTimeline;
