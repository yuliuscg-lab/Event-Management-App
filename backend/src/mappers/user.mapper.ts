import { User, Profile, Coupon } from "@prisma/client";

type UserWithRelations = User & {
    profile?: Profile | null;
    coupons?: Coupon[];
}

export function toUserResponse(user: UserWithRelations) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        refCode: user.refCode,
        refCodeInput: user.refCodeInput,
        balancePoints: user.balancePoints,
        couponsCount: user.coupons ? user.coupons.length : 0,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile ? {
            id: user.profile.id,
            avatarUrl: user.profile.avatarUrl,
        } : null
    };
}