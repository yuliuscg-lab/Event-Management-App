import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { success } from "../utils/response";
import { UserParams } from "../types/user.types";
import { cuidParamSchema } from "../validation/common.validator";
import { updateUserSchema } from "../validation/user.validator";

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

export async function findById(
  req: Request<UserParams>,
  res: Response,
  next: NextFunction
) {
  const { cuid } = cuidParamSchema.parse(req.params);
  const user = await userService.findById(cuid);

  return success(
    res,
    200,
    "User berhasil ditemukan",
    user
  );
}

export async function update(req:Request, res:Response, next:NextFunction) {
  const { cuid } = cuidParamSchema.parse(req.params);
  const body = updateUserSchema.parse(req.body);
  
  const user = await userService.update(cuid, body);
  
  return success(
    res,
    200,
    "User berhasil diupdate",
    user
  );
}

export async function remove(req:Request, res:Response, next:NextFunction) {
  const { cuid } = cuidParamSchema.parse(req.params);
  
  await userService.delete(cuid);

  return success(
    res,
    200,
    "User berhasil dihapus"
  );
}