interface User {
    username: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: Date;
    avatar: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    coverImg: string;
}

enum UserRole {
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_USER = "ROLE_USER",
    ROLE_MODERATOR = "ROLE_MODERATOR",
}

enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type { User };