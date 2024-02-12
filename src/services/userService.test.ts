import { createUser, deleteUser, updateUserStatus } from "./userService";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Repository } from "typeorm";

jest.mock("../data-source");

describe("userService", () => {
  let mockUserRepository: Partial<
    Record<keyof Repository<User>, jest.Mock<any, any, any>>
  > = {};

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository
    );
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        birthday: new Date(),
        email: "John@mail.com",
        location: "New York",
        status_reminder: "sent",
      };
      const newUser: User = { id: 1, ...userData, createdAt: new Date() };

      mockUserRepository.create!.mockReturnValue(newUser);
      mockUserRepository.save!.mockResolvedValue(newUser);

      const result = await createUser(userData);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      const userId = 1;
      const existingUser: User = {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        birthday: new Date(),
        email: "John@mail.com",
        location: "New York",
        createdAt: new Date(),
        status_reminder: "sent",
      };

      mockUserRepository.findOne?.mockResolvedValue(existingUser);

      await deleteUser(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(existingUser);
    });

    it("should throw an error if user not found", async () => {
      const userId = 1;

      mockUserRepository.findOne!.mockResolvedValue(undefined);

      await expect(deleteUser(userId)).rejects.toThrowError("User not found");

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe("updateUserStatus", () => {
    it("should update status of an existing user", async () => {
      const userId = 1;
      const userStatus = "sent";

      const mockSave = jest.fn();
      const mockUserRepository: Partial<Repository<User>> = {
        findOne: jest.fn().mockResolvedValueOnce({
          id: userId,
          status_reminder: "pending",
        }),
        save: mockSave,
      };

      AppDataSource.getRepository = jest
        .fn()
        .mockReturnValue(mockUserRepository as Repository<User>);

      await updateUserStatus(userId, userStatus);

      expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockSave).toHaveBeenCalledWith({
        id: userId,
        status_reminder: userStatus,
      });
    });

    it("should throw an error if user not found", async () => {
      const userId = 1;
      const userStatus = "sent";

      const mockUserRepository: Partial<Repository<User>> = {
        findOne: jest.fn().mockResolvedValueOnce(undefined),
      };

      AppDataSource.getRepository = jest
        .fn()
        .mockReturnValue(mockUserRepository as Repository<User>);

      await expect(updateUserStatus(userId, userStatus)).rejects.toThrowError(
        "User not found"
      );

      expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
