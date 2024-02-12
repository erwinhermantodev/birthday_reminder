import {
  initializeReminder,
  initializeReminderRefreshStatus,
  sendBirthdayMessage,
  reminderQueue,
} from "./birthdayReminder";
import { User } from "../entities/User";
import { scheduleJob } from "node-schedule";
import { updateUserStatus } from "./userService";
import axios from "axios";
import Bull from "bull";

jest.mock("node-schedule");
jest.mock("axios");
jest.mock("./userService");
jest.mock("bull");

describe("initializeReminder", () => {
  it("should schedule job to send birthday messages", async () => {
    const users: User[] = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        birthday: new Date("2000-01-01"),
        email: "john@example.com",
        location: "America/New_York",
        status_reminder: "pending",
        createdAt: new Date(),
      },
    ];

    await initializeReminder(users);

    expect(scheduleJob).toHaveBeenCalled();
  });
});

describe("initializeReminderRefreshStatus", () => {
  it("should schedule job to refresh status reminders", async () => {
    const users: User[] = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        birthday: new Date("2000-01-01"),
        email: "john@example.com",
        location: "America/New_York",
        status_reminder: "pending",
        createdAt: new Date(),
      },
    ];

    await initializeReminderRefreshStatus(users);

    expect(scheduleJob).toHaveBeenCalled();
  });
});

describe("sendBirthdayMessage", () => {
  it("should send birthday message and update user status", async () => {
    const userId = 1;
    const email = "john@example.com";
    const message = "Happy Birthday!";
    const response = { data: { status: "sent" } };

    (axios.post as jest.Mock).mockResolvedValue(response);

    await sendBirthdayMessage(userId, email, message);

    expect(axios.post).toHaveBeenCalledWith(
      "https://email-service.digitalenvision.com.au/send-email",
      { email, message },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    expect(updateUserStatus).toHaveBeenCalledWith(userId, "sent");
  });
});
