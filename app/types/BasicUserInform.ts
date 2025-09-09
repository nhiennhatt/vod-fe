import type { User } from "./User";

type BasicUserInform = Pick<User, "username" | "firstName" | "lastName" | "avatar" | "role" | "status">;

export type { BasicUserInform };