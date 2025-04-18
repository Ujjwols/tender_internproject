
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "./NotificationItem";
import { NotificationFilters } from "./NotificationFilters";
import { checkUpcomingDeadlines } from "@/utils/deadlineUtils";
import type { NotificationCenterProps, Notification } from "@/types/notification";

const NotificationCenter = ({ 
  notifications, 
  onMarkAsRead,
  onUpdateReminderPreferences 
}: NotificationCenterProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'status_change' | 'deadline' | 'email'>('all');
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  // Check for deadlines every minute
  useEffect(() => {
    const checkDeadlines = () => {
      const newDeadlineNotifications = checkUpcomingDeadlines(notifications);
      if (newDeadlineNotifications.length > 0) {
        newDeadlineNotifications.forEach(notification => {
          if (notification.reminderPreferences?.inApp) {
            toast({
              title: "Upcoming Deadline",
              description: notification.message,
            });
          }
        });
        // Add new notifications to localStorage
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        localStorage.setItem('notifications', JSON.stringify([
          ...existingNotifications,
          ...newDeadlineNotifications
        ]));
      }
    };

    checkDeadlines(); // Initial check
    const interval = setInterval(checkDeadlines, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notifications, toast]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setLocalNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkAsRead = (id: number) => {
    onMarkAsRead?.(id);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
    setIsOpen(false);
  };

  const handleUpdateReminderPreferences = (id: number, preferences: Notification['reminderPreferences']) => {
    onUpdateReminderPreferences?.(id, preferences);
    toast({
      title: "Reminder preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleClearAll = () => {
    localStorage.removeItem('notifications');
    setLocalNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return groups;
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' ? true : notification.type === filter
  );

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white" align="end">
        <NotificationFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          onClearAll={handleClearAll}
        />
        <ScrollArea className="h-[400px]">
          {Object.entries(groupedNotifications).length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No notifications
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([date, notifications]) => (
              <div key={date}>
                <div className="sticky top-0 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                  {date}
                </div>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleMarkAsRead}
                    onUpdateReminderPreferences={handleUpdateReminderPreferences}
                  />
                ))}
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
