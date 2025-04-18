
export type UserRole = 
  | 'admin' 
  | 'procurement_officer' 
  | 'committee_member' 
  | 'evaluator' 
  | 'bidder'
  | 'complaint_manager'
  | 'project_manager';

export type ModulePermission =
  | 'manage_users'
  | 'manage_tenders'
  | 'manage_committees'
  | 'view_reports'
  | 'create_tender'
  | 'manage_bids'
  | 'view_submissions'
  | 'view_specifications'
  | 'submit_reviews'
  | 'attend_meetings'
  | 'evaluate_bids'
  | 'view_documents'
  | 'manage_complaints'
  | 'manage_projects'
  | 'upload_documents'
  | 'view_sensitive_data'
  | 'manage_notifications'
  | 'manage_partners';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  permissions: ModulePermission[];
  phoneNumber?: string;
  designation?: string;
  lastLogin?: string;
  isActive: boolean;
  otpEnabled?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

export interface ModuleAccess {
  module: string;
  permissions: ModulePermission[];
  restrictedTo?: UserRole[];
}

