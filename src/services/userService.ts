import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Repository } from "typeorm";

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const userRepository = getUserRepository();
  const newUser = userRepository.create(userData);
  return await userRepository.save(newUser);
};

export const deleteUser = async (userId: number): Promise<void> => {
  const userRepository = getUserRepository();
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  await userRepository.remove(user);
};

export const updateUserStatus = async (
  userId: number,
  status: string
): Promise<void> => {
  try {
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    user.status_reminder = status;
    await userRepository.save(user);
  } catch (error) {
    throw error;
  }
};

const getUserRepository = (): Repository<User> => {
  return AppDataSource.getRepository(User);
};
