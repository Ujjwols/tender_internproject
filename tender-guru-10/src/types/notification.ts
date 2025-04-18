export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'deadline' | 'email' | 'committee';
  deadline?: string;
  reminderTime?: number;
  reminderPreferences?: {
    email: boolean;
    inApp: boolean;
    customTime?: number;
  };
  committeeInfo?: {
    committeeId: number;
    formationDate: string;
    submissionDate: string;
    role: 'member' | 'chairperson' | 'secretary';
    taskId?: number;
  };
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
  onUpdateReminderPreferences?: (id: number, preferences: Notification['reminderPreferences']) => void;
}

export interface ReminderSchedule {
  beforeDeadline: number; // hours before deadline
  repetition: 'once' | 'daily' | 'weekly';
  channels: {
    email: boolean;
    inApp: boolean;
    browser: boolean;
  };
}

export interface DeadlineNotification {
  id: number;
  title: string;
  deadline: string;
  reminderSchedule: ReminderSchedule;
  status: 'pending' | 'sent' | 'cancelled';
  lastSent?: string;
  nextReminder?: string;
}

export interface CommitteeMember {
  id: number;
  employeeId: string;
  name: string;
  role: 'member' | 'chairperson' | 'secretary';
  email?: string;
  phone?: string;
  department?: string;
  tasks?: CommitteeTask[];
}

export interface CommitteeTask {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  attachments?: File[];
  comments?: string[];
}

export interface Committee {
  id: number;
  name: string;
  formationDate: string;
  formationLetter?: File;
  purpose: string;
  members: CommitteeMember[];
  tasks: CommitteeTask[];
  specifications: {
    submissionDate: string;
    documents: File[];
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  };
  reviews: any[]; // This will be typed properly when needed
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
}
