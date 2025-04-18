
export const sendNotification = (
  type: 'email' | 'sms',
  to: string,
  message: string
) => {
  // In a real implementation, this would integrate with an email/SMS service
  console.log(`Sending ${type} to ${to}: ${message}`);
};

export const generateCommitteeNotification = (
  committeeId: number,
  type: 'formation' | 'review' | 'task',
  details: Record<string, any>
) => {
  const messages = {
    formation: `New committee #${committeeId} has been formed. Please check your email for details.`,
    review: `Review scheduled for committee #${committeeId} on ${details.date}.`,
    task: `New task assigned in committee #${committeeId}: ${details.taskName}`,
  };

  return messages[type];
};
