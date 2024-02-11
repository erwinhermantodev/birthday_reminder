import { getConnection, ConnectionNotFoundError } from "typeorm";
import { AppDataSource } from "../data-source";
import {
  initializeReminder,
  initializeReminderRefreshStatus,
} from "./birthdayReminder";
import { User } from "../entities/User";

export const initializeBirthdayReminder = async (): Promise<void> => {
  try {
    await initializeDatabaseConnection();
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    initializeReminder(users);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const initializeBirthdayReminderRefresh = async (): Promise<void> => {
  try {
    await initializeDatabaseConnection();
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      where: { status_reminder: "sent" },
    });
    initializeReminderRefreshStatus(users);
  } catch (error) {
    console.error("Error:", error);
  }
};

const initializeDatabaseConnection = async (): Promise<void> => {
  try {
    getConnection(); // Try to get the default connection
  } catch (error) {
    if (error instanceof ConnectionNotFoundError) {
      await AppDataSource.initialize();
    } else {
      throw error; // Rethrow other errors
    }
  }
};
