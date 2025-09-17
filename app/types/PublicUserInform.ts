import type { User } from "./User";

export type PublicUserInform = Pick<User, "username" | "firstName" | "lastName" | "middleName" | "avatar" | "coverImg" | "description"> & {
  coverImage?: string; // Alias for coverImg
};