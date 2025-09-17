import type { User } from "./User";

type BasicUserInform = Pick<
  User,
  "username" | "firstName" | "lastName" | "middleName" | "avatar" | "role" | "status" | "coverImg" | "dateOfBirth" | "description" | "email"
>;

export type { BasicUserInform };