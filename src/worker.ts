import {
  reminderQueue,
  sendBirthdayMessage,
} from "./services/birthdayReminder";

// Process jobs from the queue
reminderQueue.process(async (job: any) => {
  console.log(`Processing job ${job.id}`);
  const { userId, email, message } = job.data;
  // Resend failed message
  await resendFailedMessage(userId, email, message);
});

const resendFailedMessage = async (
  userId: number,
  email: string,
  message: string
): Promise<void> => {
  // Implement logic to resend failed message
  await sendBirthdayMessage(userId, email, message);
};
