import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { success } from "../utils/response";
import { UserParams } from "../types/user.types";

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

export async function create(req:Request, res:Response, next:NextFunction ) {
  const user = await userService.create(req.body);

  return success(
    res,
    201,
    "User created successfully",
    user
  );
}

export async function findById(
  req: Request<UserParams>,
  res: Response,
  next: NextFunction
) {
  const user = await userService.findById(req.params.id);
  return success(
    res,
    200,
    "User berhasil ditemukan",
    user
  );
}

export async function update(req:Request<UserParams>, res:Response, next:NextFunction) {
  const user = await userService.update(req.params.id, req.body);
  
  return success(
    res,
    200,
    "User berhasil diupdate",
    user
  );
}