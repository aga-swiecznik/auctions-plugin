import { User } from "@prisma/client";

export const checkAdmin = (user?: string | null) => {
    return user && ["marek", "aga"].includes(user.toLowerCase());
};