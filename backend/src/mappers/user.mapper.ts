import { User } from "@prisma/client";

export function toUserResponse(user:User) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        refCode: user.refCode,
        refCodeInput: user.refCodeInput,
        balancePoints: user.balancePoints,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}