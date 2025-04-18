
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationItem } from "@/types/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileNavigationProps {
  items: NavigationItem[];
  isOpen: boolean;
  showCommitteeSubItems: boolean;
  setShowCommitteeSubItems: (show: boolean) => void;
  onClose: () => void;
}

export const MobileNavigation = ({ 
  items, 
  isOpen, 
  showCommitteeSubItems, 
  setShowCommitteeSubItems, 
  onClose 
}: MobileNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden pb-4">
      <div className="space-y-1 pt-2">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.subItems) {
            return (
              <div key={item.path} className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left font-semibold ${
                    location.pathname.startsWith(item.path)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600"
                  }`}
                  onClick={() => setShowCommitteeSubItems(!showCommitteeSubItems)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
                {showCommitteeSubItems && (
                  <div className="pl-4 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Button
                          key={subItem.path}
                          variant="ghost"
                          className={`w-full justify-start text-left ${
                            isActive(subItem.path)
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            navigate(subItem.path);
                            onClose();
                            setShowCommitteeSubItems(false);
                          }}
                        >
                          <SubIcon className="mr-2 h-4 w-4" />
                          {subItem.name}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full justify-start text-left ${
                isActive(item.path)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
        <DropdownMenuSeparator className="my-2" />
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
