
import { useNavigate } from "react-router-dom";
import { Menu, X, Home, FileText, Users, Settings, Bell, UserPlus, FolderOpen, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "@/types/navigation";
import DesktopNavigation from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { UserMenu } from "./UserMenu";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCommitteeSubItems, setShowCommitteeSubItems] = useState(false);
  const isMobile = useIsMobile();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowCommitteeSubItems(false);
  }, [location.pathname]);

  const navigationItems: NavigationItem[] = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Tenders", path: "/tenders", icon: FileText },
    { name: "Specification", path: "/specification/1", icon: FileSearch },
    {
      name: "Committee",
      path: "/committee",
      icon: Users,
      subItems: [
        { name: "Create Committee", path: "/committee/create", icon: UserPlus },
        { name: "View Committees", path: "/committee", icon: FolderOpen },
      ],
    },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            <h1 
              onClick={() => navigate("/")}
              className="text-xl font-semibold text-gray-900 cursor-pointer"
            >
              Procurement Portal
            </h1>
          </div>

          <DesktopNavigation />

          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>

        <div className="md:hidden">
          <MobileNavigation
            items={navigationItems}
            isOpen={isMenuOpen}
            showCommitteeSubItems={showCommitteeSubItems}
            setShowCommitteeSubItems={setShowCommitteeSubItems}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
