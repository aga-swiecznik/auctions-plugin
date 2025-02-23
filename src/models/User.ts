import { User } from "@prisma/client";

export type UserWithRole = User & { role: "admin" | "moderator" };