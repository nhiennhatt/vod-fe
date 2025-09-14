import type { User } from "./User";

export type PublicUserInform = Pick<User, "firstName" | "lastName" | "middleName" | "avatar" | "coverImg" | "description">;