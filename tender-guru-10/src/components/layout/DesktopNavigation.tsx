
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  Bell,
  Users,
  FileText,
  BarChart3,
  FileSearch,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Committee", path: "/committee", icon: Users },
  { name: "Specification", path: "/specification/1", icon: FileSearch },
  { name: "Tenders", path: "/tenders", icon: FileText },
  { name: "Procurement Plan", path: "/procurement-plan", icon: BarChart3 },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

const DesktopNavigation = () => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-4">
      {navigation.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default DesktopNavigation;
