interface VideoOverview {
    uid: string;
    title: string;
    thumbnail: string;
    user: {
        username: string;
        firstName: string;
        lastName: string;   
    },
    createdOn: Date;
}

export type { VideoOverview };
