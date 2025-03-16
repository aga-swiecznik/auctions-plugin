import { User } from "@prisma/client";

export type Role = "admin" | "moderator" 

export type UserWithRole = User & { role: Role };