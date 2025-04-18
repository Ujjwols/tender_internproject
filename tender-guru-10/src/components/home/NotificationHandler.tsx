
import { Notification } from "@/types/notification";
import NotificationCenter from "@/components/review/NotificationCenter";
import Welcome from "@/components/home/Welcome";

interface NotificationHandlerProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onUpdateReminderPreferences: (id: number, preferences: Notification['reminderPreferences']) => void;
}

const NotificationHandler = ({
  notifications,
  onMarkAsRead,
  onUpdateReminderPreferences
}: NotificationHandlerProps) => {
  return (
    <div className="flex justify-between items-start mb-8 animate-fade-in">
      <div className="flex-1">
        <Welcome />
      </div>
      <div className="ml-4 relative">
        <div className="transition-all duration-200 hover:scale-105">
          <NotificationCenter 
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onUpdateReminderPreferences={onUpdateReminderPreferences}
          />
        </div>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default NotificationHandler;
