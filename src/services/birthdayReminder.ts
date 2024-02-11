import { scheduleJob } from "node-schedule";
import axios from "axios";
import { User } from "../entities/User";
import Bull from "bull";
import { updateUserStatus } from "./userService";
import { DateTime } from "luxon";

export const reminderQueue = new Bull("reminderQueue");

export const initializeReminder = (users: User[]): void => {
  try {
    scheduleJob("1 0 * * *", async () => {
      for (const user of users) {
        const { firstName, lastName, location } = user;
        const today = DateTime.now().setZone(location).toJSDate(); // Get today's date based on user's location
        if (
          isBirthday(user.birthday, today) &&
          user.status_reminder !== "sent"
        ) {
          const fullName = `${firstName} ${lastName}`;
          const message = `Hey, ${fullName}, it's your birthday!`;
          await sendBirthdayMessage(user.id, user.email, message);
        }
      }
    });
    console.log("Birthday reminder job scheduled.");
  } catch (error) {
    console.error("Error scheduling job:", error);
  }
};

export const initializeReminderRefreshStatus = (users: User[]): void => {
  try {
    scheduleJob("0 23 31 12 *", async () => {
      for (const user of users) {
        const { location } = user;
        const today = DateTime.now().setZone(location).toJSDate();
        if (
          isBirthday(user.birthday, today) &&
          user.status_reminder !== "sent"
        ) {
          await updateUserStatus(user.id, "pending");
        }
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

export const sendBirthdayMessage = async (
  userId: number,
  email: string,
  message: string
): Promise<void> => {
  const data = {
    email: `${email}`,
    message: `${message}`,
  };

  try {
    await axios
      .post("https://email-service.digitalenvision.com.au/send-email", data, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
        const { status } = response.data;
        updateUserStatus(userId, status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log(`${message}`);
  } catch (error) {
    console.error("Error sending birthday message:", error);
    await insertFailedMessageToQueue(userId, email, message);
  }
};

const insertFailedMessageToQueue = async (
  userId: number,
  email: string,
  message: string
): Promise<void> => {
  await reminderQueue.add(
    { userId, email, message },
    {
      delay: 5 * 60 * 1000,
      attempts: 3,
    }
  );
};

reminderQueue.on("failed", async (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err}`);
  await job.retry();
});
