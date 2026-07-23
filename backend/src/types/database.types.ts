import { Prisma, PrismaClient } from "@prisma/client";


export type DB = PrismaClient | Prisma.TransactionClient;