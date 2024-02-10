import { scheduleJob } from "node-schedule";
import { User } from "../entities/User";

export const initializeReminder = (users: User[]): void => {
  try {
    scheduleJob("0 9 * * *", async () => {
      const today = new Date();
      const birthdayUsers = users.filter((user) =>
        isBirthday(user.birthday, today)
      );
      for (const user of birthdayUsers) {
        await sendBirthdayMessage(user);
      }
    });
    console.log("Birthday reminder job scheduled.");
  } catch (error) {
    console.error("Error scheduling job:", error);
  }
};

const isBirthday = (birthday: Date, today: Date): boolean => {
  return (
    birthday.getMonth() === today.getMonth() &&
    birthday.getDate() === today.getDate()
  );
};

const sendBirthdayMessage = async (user: User): Promise<void> => {
  try {
    const { firstName, lastName } = user;
    const fullName = `${firstName} ${lastName}`;
    const message = `Hey, ${fullName}, it's your birthday!`;
    // Send request to email service endpoint
    // For now, let's assume we have an email service to send messages
    console.log(`Birthday message sent to ${fullName}`);
  } catch (error) {
    console.error("Error sending birthday message:", error);
  }
};
