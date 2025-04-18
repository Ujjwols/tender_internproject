
import type { Notification } from "@/types/notification";
import { sendNotification } from "@/utils/notificationUtils";

export const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "New committee formation: Network Infrastructure Committee",
    read: false,
    timestamp: new Date().toISOString(),
    type: "committee",
    committeeInfo: {
      committeeId: 1,
      formationDate: "2024-03-01",
      submissionDate: "2024-04-15",
      role: "chairperson",
    }
  },
  {
    id: 2,
    message: "Specification review scheduled for Network Infrastructure Project",
    read: false,
    timestamp: new Date().toISOString(),
    type: "committee",
    committeeInfo: {
      committeeId: 1,
      formationDate: "2024-03-01",
      submissionDate: "2024-04-15",
      role: "member",
    }
  }
];

export const sendCommitteeNotification = (
  members: { email: string; phone: string; role: string }[],
  message: string
) => {
  members.forEach(member => {
    // Mock sending email
    console.log(`Sending email to ${member.email}: ${message}`);
    // Mock sending SMS
    console.log(`Sending SMS to ${member.phone}: ${message}`);
  });
};

export const createCommitteeNotification = (
  message: string,
  committeeId: number,
  formationDate: string,
  submissionDate: string,
  role: 'member' | 'chairperson' | 'secretary'
): Notification => {
  return {
    id: Date.now(),
    message,
    read: false,
    timestamp: new Date().toISOString(),
    type: "committee",
    committeeInfo: {
      committeeId,
      formationDate,
      submissionDate,
      role,
    }
  };
};
