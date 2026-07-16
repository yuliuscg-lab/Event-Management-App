import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id:string) {
    return prisma.user.findUnique({
      where: {id},
    });
  }

  async findByEmail(email:string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone:string) {
    return prisma.user.findUnique({
      where: {phone},
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async findByRefCode(refCode:string) {
    return prisma.user.findUnique({
      where: {refCode}
    })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
