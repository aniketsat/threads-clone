/// <reference types="vite/client" />
type ThreadType = {
    id: string | number;
    content?: string;
    picture?: string;
    RepostTo?: ThreadType;
    createdAt?: string;
    updatedAt?: string;
    Creator?: {
        id: string;
        username: string;
        avatar?: string;
        UserId: string;
    };
    Likes?: {
        id: string;
        ProfileId: string;
        ThreadId: string;
    }[];
    ChildThreads?: ThreadType[];
}