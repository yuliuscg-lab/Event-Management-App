import { User, Profile } from "@prisma/client";

type UserWithProfile = User & {
    profile?: Profile | null;
}

export function toUserResponse(user:UserWithProfile) {
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
        updatedAt: user.updatedAt,
        profile: user.profile ? {
            id: user.profile.id,
            avatarUrl: user.profile.avatarUrl,
        } : null
    };
}