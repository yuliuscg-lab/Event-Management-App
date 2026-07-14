import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { success } from "../utils/response";

export async function findAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const users = await userService.findAll();

  return success(
    res,
    200,
    "Users retrieved successfully",
    users
  )
}