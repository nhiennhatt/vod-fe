interface VideoDetail {
    title: string;
    fileName: string;
    status: VideoStatus;
    user: {
        username: string;
        userInform: {
            avatar: string;
            firstName: string;
            lastName: string;
        };
    };
    privacy: VideoPrivacy;
    thumbnail: string;
    uid: string;
    description: string;
}

enum VideoPrivacy {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    LIMITED = "LIMITED",
}

enum VideoStatus {
    PROCESSING = "PROCESSING",
    READY = "ACTIVE",
    FAILED = "INACTIVE",
}

export { VideoPrivacy, VideoStatus };
export type { VideoDetail };
