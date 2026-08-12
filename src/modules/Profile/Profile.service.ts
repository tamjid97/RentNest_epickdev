import { prisma } from "../../lib/prisma";

const getProfileFromDB = async (userId: string) => {
    const profile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePhoto: true,
            role: true,
            activeStatus: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!profile) {
        throw new Error("Profile not found!");
    }

    return profile;
};

const updateProfileIntoDB = async (
    userId: string,
    payload: { name?: string; profilePhoto?: string; phoneNumber?: string; [key: string]: any }
) => {
    const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePhoto: true,
            role: true,
            activeStatus: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return updatedProfile;
};

export const profileServices = {
    getProfileFromDB,
    updateProfileIntoDB,
};