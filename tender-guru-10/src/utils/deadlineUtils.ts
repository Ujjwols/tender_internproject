
import type { Notification as CustomNotification, CommitteeMember, Committee, CommitteeTask, ReminderSchedule } from "@/types/notification";

const calculateNextReminder = (deadline: Date, schedule: ReminderSchedule): Date => {
  const reminderTime = new Date(deadline.getTime() - (schedule.beforeDeadline * 60 * 60 * 1000));
  return reminderTime;
};

export const checkUpcomingDeadlines = (notifications: CustomNotification[]): CustomNotification[] => {
  const now = new Date();
  const newNotifications: CustomNotification[] = [];
  
  notifications
    .filter(n => (n.type === 'deadline' || n.type === 'committee') && n.deadline && !n.read)
    .forEach(notification => {
      const deadline = new Date(notification.deadline!);
      const reminderTime = notification.reminderPreferences?.customTime || 
                          notification.reminderTime || 
                          24; // Default 24 hours
      const reminderDate = new Date(deadline.getTime() - (reminderTime * 60 * 60 * 1000));
      
      if (now >= reminderDate && now < deadline) {
        const hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        if (notification.type === 'committee' && notification.committeeInfo) {
          newNotifications.push({
            id: Date.now(),
            message: `Committee Reminder: ${hoursLeft} hours left until ${notification.message}`,
            read: false,
            timestamp: new Date().toISOString(),
            type: 'committee',
            deadline: notification.deadline,
            reminderTime: reminderTime,
            reminderPreferences: {
              ...notification.reminderPreferences,
              customTime: reminderTime
            },
            committeeInfo: notification.committeeInfo
          });
        } else {
          newNotifications.push({
            id: Date.now(),
            message: `Reminder: ${hoursLeft} hours left until deadline for ${notification.message}`,
            read: false,
            timestamp: new Date().toISOString(),
            type: 'deadline',
            deadline: notification.deadline,
            reminderTime: reminderTime,
            reminderPreferences: {
              ...notification.reminderPreferences,
              customTime: reminderTime
            }
          });
        }
      }
    });
    
  return newNotifications;
};

export const createCommitteeNotification = (
  committee: Committee,
  member: CommitteeMember,
  task?: CommitteeTask
): CustomNotification => {
  const baseNotification = {
    id: Date.now(),
    read: false,
    timestamp: new Date().toISOString(),
    type: 'committee' as const,
    committeeInfo: {
      committeeId: committee.id,
      formationDate: committee.formationDate,
      submissionDate: committee.specifications.submissionDate,
      role: member.role,
      taskId: task?.id
    }
  };

  const defaultReminderPreferences = {
    email: true,
    inApp: true,
    browser: true,
    customTime: task ? 24 : 48 // 24 hours for tasks, 48 for committee notifications
  };

  if (task) {
    return {
      ...baseNotification,
      message: `New task assigned: ${task.title}`,
      deadline: task.dueDate,
      reminderTime: defaultReminderPreferences.customTime,
      reminderPreferences: defaultReminderPreferences
    };
  }

  return {
    ...baseNotification,
    message: `You have been assigned as ${member.role} to a new committee`,
    deadline: committee.specifications.submissionDate,
    reminderTime: defaultReminderPreferences.customTime,
    reminderPreferences: defaultReminderPreferences
  };
};

export const scheduleReminder = (
  notification: CustomNotification,
  schedule: ReminderSchedule
): void => {
  if (!notification.deadline) return;

  const deadline = new Date(notification.deadline);
  const nextReminder = calculateNextReminder(deadline, schedule);
  
  console.log(`Scheduled reminder for ${nextReminder.toISOString()}`);
  
  // Schedule browser notification if enabled
  if (schedule.channels.browser && "Notification" in window) {
    const timeUntilReminder = nextReminder.getTime() - new Date().getTime();
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        new globalThis.Notification("Deadline Reminder", {
          body: notification.message,
          icon: "/favicon.ico"
        });
      }, timeUntilReminder);
    }
  }

  // Log email notification (in real app, would integrate with email service)
  if (schedule.channels.email) {
    console.log(`Would send email reminder for: ${notification.message}`);
  }
};
