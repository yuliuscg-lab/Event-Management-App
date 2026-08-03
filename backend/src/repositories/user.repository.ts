import { DB } from "../types/database.types";
import { Prisma } from "@prisma/client";

export class UserRepository {

  async findAll(db:DB) {
    return db.user.findMany()
  }

  async findById(db:DB,id:string) {
    return db.user.findUnique({
      where: {id},
      include:{ 
        profile:true,
        coupons: {
          where: {
            isUsed: false,
            expiredAt: { gte: new Date() }
          }
        }
      }
    });
  }

  async findByEmail(db:DB,email:string) {
    return db.user.findUnique({
      where: { email },
      include: { 
        profile:true,
        coupons: {
          where: {
            isUsed: false,
            expiredAt: { gte: new Date() }
          }
        }
      }
    });
  }

  async findByPhone(db:DB,phone:string) {
    return db.user.findUnique({
      where: {phone},
      include: { 
        profile:true,
        coupons: {
          where: {
            isUsed: false,
            expiredAt: { gte: new Date() }
          }
        }
      }
    });
  }

  async create(db: DB, data: Prisma.UserCreateInput) {
    return db.user.create({
      data,
    });
  }

  async update(db:DB,id: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: { id },
      data,
    });
  }

  async incrementBalancePoints(db: DB, id:string, amount:number) {
    return db.user.update({
      where: {id},
      data: {
        balancePoints: {
          increment: amount,
        },
      },
    });
  }

  async decrementBalancePoints(db: DB, id:string, amount:number) {
    return db.user.update({
      where: {id},
      data: {
        balancePoints: {
          decrement: amount,
        },
      },
    });
  }

  async findByRefCode(db:DB, refCode:string) {
    return db.user.findUnique({
      where: {
        refCode,
      },
    });
  }

  async delete(db:DB,id: string) {
    return db.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
