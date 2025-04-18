
import { useState } from "react";
import QuickActions from "@/components/home/QuickActions";
import Modals from "@/components/home/Modals";
import type { Notification } from "@/types/notification";
import { mockNotifications } from "@/mock/committeeNotifications";
import NotificationHandler from "@/components/home/NotificationHandler";
import RoleBasedTabs from "@/components/home/RoleBasedTabs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";
import type { User, UserRole } from "@/types/auth";

const Index = () => {
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock user for dashboard display with correct User type properties
  const mockUser: User = {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as UserRole,
    permissions: ["manage_users", "manage_tenders", "manage_committees"],
    isActive: true
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleUpdateReminderPreferences = (id: number, preferences: Notification['reminderPreferences']) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, reminderPreferences: preferences } : notification
    ));
  };

  const handleExport = () => {
    exportToCSV(notifications, 'notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-8 animate-fadeIn">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-white/80 backdrop-blur-sm border-gray-200 focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full md:w-auto glass-card hover:bg-gray-100 transition-colors"
            >
              Export Data
            </Button>
          </div>

          {/* Notifications Section */}
          <div className="glass-card rounded-xl p-4 md:p-6 shadow-lg animate-slideIn">
            <NotificationHandler
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onUpdateReminderPreferences={handleUpdateReminderPreferences}
            />
          </div>

          {/* Quick Actions Section */}
          <div className="glass-card rounded-xl p-4 md:p-6 shadow-lg animate-slideIn delay-100">
            <QuickActions 
              onShowCommitteeForm={() => setShowCommitteeForm(true)}
              onShowTenderForm={() => setShowTenderForm(true)}
              onShowVendorForm={() => setShowVendorForm(true)}
              onShowComplaints={() => setShowComplaints(true)}
            />
          </div>

          {/* Stats Section */}
          <div className="glass-card rounded-xl p-4 md:p-6 shadow-lg animate-slideIn delay-200">
            <DashboardStats />
          </div>

          {/* Tabs Section */}
          <div className="glass-card rounded-xl p-4 md:p-6 shadow-lg animate-slideIn delay-300">
            <RoleBasedTabs user={mockUser} defaultTab="dashboard" />
          </div>

          {/* Modals */}
          <Modals 
            showComplaints={showComplaints}
            showCommitteeForm={showCommitteeForm}
            showTenderForm={showTenderForm}
            showVendorForm={showVendorForm}
            onCloseComplaints={() => setShowComplaints(false)}
            onCloseCommitteeForm={() => setShowCommitteeForm(false)}
            onCloseTenderForm={() => setShowTenderForm(false)}
            onCloseVendorForm={() => setShowVendorForm(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
