import { Role } from "@prisma/client";
import { ParamsDictionary } from "express-serve-static-core";

export interface CreateUser {
    email: string;
    password: string;
    balancePoints: number;
    role: Role;
    phone: string;
    name: string;
    refCode: string;
    refCodeInput?: string;
}

export interface UserParams extends ParamsDictionary {
    id:string
}

export interface UpdateUser {
    phone?:string;
    name?:string;
}