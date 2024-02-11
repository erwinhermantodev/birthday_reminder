import { Request, Response } from "express";
import {
  createUser as createUserHandler,
  deleteUser as deleteUserHandler,
} from "../services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserHandler(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    await deleteUserHandler(userId);
    return res.status(204).send(); // No content
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
