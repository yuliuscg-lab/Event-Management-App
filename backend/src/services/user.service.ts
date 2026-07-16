import { AppError } from "../errors/AppError";
import { toUserResponse } from "../mappers/user.mapper";
import { userRepository } from "../repositories/user.repository";
import { CreateUser } from "../types/user.types";
import { generateReferral } from "../utils/generateReferral";
import { hashPassword } from "../utils/password";

export class UserService {
  async findAll() {
    return userRepository.findAll();
  }

  async findById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User tidak ditemukan!",404)
    }

    return toUserResponse(user);
  }

private async generateRefCode(nama:string): Promise<string> {
  while (true) {
    const code = generateReferral(nama);

    const existingRefCode = await userRepository.findByRefCode(code);

    if (!existingRefCode) {
      return code;
    }
  }
}

  async create(data: CreateUser) {

    const existingUser = await userRepository.findByEmail(data.email);

    if(existingUser) {
      throw new AppError(
        "Email sudah terdaftar",
        409
      );
    }
    const refCode:string = await this.generateRefCode(data.name);
    const hashedPassword = await hashPassword(data.password);

    const userData = {
      ...data,
      password:hashedPassword,
      refCode
    }
      
    const user =  await userRepository.create(userData);
    return toUserResponse(user);
  }

  async update(id: string, data: any) {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new AppError("User tidak ditemukan", 404)
    }

    if (data.phone && data.phone !== existingUser.phone ) {
      const existingPhone = await userRepository.findByPhone(data.phone);

      if (existingPhone) {
        throw new AppError("Nomor sudah digunakan!", 409);
      }
    }

    const updatedUser = await userRepository.update(id,data);
    
    return toUserResponse(updatedUser);
  }

  async delete(id: string) {
    return userRepository.delete(id);
  }

}

export const userService = new UserService();