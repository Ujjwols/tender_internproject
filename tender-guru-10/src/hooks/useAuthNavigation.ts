
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth";

export const useAuthNavigation = (isAuthenticated: boolean, user: User | null) => {
  const [defaultTab, setDefaultTab] = useState("dashboard");
  return { defaultTab };
};
