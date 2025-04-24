import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
  department: string;
  phoneNumber: string;
  designation: string;
  isActive: boolean;
  otpEnabled: boolean;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  employees: User[];
  employeesLoading: boolean;
  employeesError: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  employeeId?: string;
  department?: string;
  phoneNumber?: string;
  designation?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  phoneNumber?: string;
  designation?: string;
  isActive?: boolean;
  otpEnabled?: boolean;
}

interface AuthMethods {
  login: (token: string, user: User) => Promise<boolean>;
  verifyOTP: (userId: string, otp: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  fetchEmployees: () => Promise<void>;
  refetchEmployees: () => Promise<void>;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

type AuthContextType = AuthState & AuthMethods;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    return {
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
      token: token || null,
      employees: [],
      employeesLoading: false,
      employeesError: null,
    };
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      if (state.user) {
        localStorage.setItem("user", JSON.stringify(state.user));
      }
      fetchEmployees();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [state.token]);

  const login = async (token: string, user: User): Promise<boolean> => {
    try {
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        token,
      }));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to complete login",
        variant: "destructive",
      });
      return false;
    }
  };

  const verifyOTP = async (userId: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      setState(prev => ({
        ...prev,
        user: data.data.user,
        isAuthenticated: true,
        token: data.token,
      }));

      toast({
        title: "OTP Verified",
        description: "Login successful!",
      });

      return true;
    } catch (error) {
      toast({
        title: "OTP Verification Failed",
        description: error instanceof Error ? error.message : "Invalid or expired OTP",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Registration Successful",
        description: `Welcome ${data.data.user.name}! You can now login.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchEmployees = async (): Promise<void> => {
    if (!state.token) return;
    
    try {
      setState(prev => ({
        ...prev,
        employeesLoading: true,
        employeesError: null,
      }));
      
      const response = await fetch("http://localhost:5000/api/v1/auth/users", {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data?.users) {
        throw new Error("Invalid data format received from server");
      }
      
      setState(prev => ({
        ...prev,
        employees: data.data.users,
        employeesLoading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        employeesError: err instanceof Error ? err.message : "Failed to fetch employees",
        employeesLoading: false,
      }));
    }
  };

  const refetchEmployees = async (): Promise<void> => {
    await fetchEmployees();
  };

  const updateUser = async (userId: string, userData: UpdateUserData): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/auth/users/${userId}`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      toast({
        title: "Update Successful",
        description: `User has been updated.`,
      });

      await refetchEmployees();
      return true;
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete user');
      }

      toast({
        title: "Deletion Successful",
        description: "User has been deleted.",
      });

      await refetchEmployees();
      return true;
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      token: null,
      employees: [],
      employeesLoading: false,
      employeesError: null,
    });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    return state.user.permissions.includes(permission) || 
           state.user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      ...state,
      login,
      verifyOTP,
      register,
      logout,
      hasPermission,
      fetchEmployees,
      refetchEmployees,
      updateUser,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};