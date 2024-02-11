import { Request, Response } from "express";
import { createUser, deleteUser } from "./userController";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Repository } from "typeorm";

jest.mock("../data-source");

describe("userController", () => {
  let mockUserRepository: Partial<
    Record<keyof Repository<User>, jest.Mock<any, any, any>>
  > = {};
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

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

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
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

      mockRequest.body = userData;
      mockUserRepository.create!.mockReturnValue(newUser);
      mockUserRepository.save!.mockResolvedValue(newUser);

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      const userId = "1"; // Change to string
      const existingUser: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        birthday: new Date(),
        email: "John@mail.com",
        location: "New York",
        createdAt: new Date(),
        status_reminder: "sent",
      };

      mockRequest.params = { id: userId };
      mockUserRepository.findOne?.mockResolvedValue(existingUser);

      await deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: parseInt(userId) }, // Parse userId to ensure it's a number
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(existingUser);
    });

    it("should return 500 if an error occurs", async () => {
      const userId = "1"; // Change to string
      const errorMessage = "Internal server error";

      mockRequest.params = { id: userId };
      mockUserRepository.findOne!.mockRejectedValue(new Error(errorMessage));

      await deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: parseInt(userId) }, // Parse userId to ensure it's a number
      });
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });
});
