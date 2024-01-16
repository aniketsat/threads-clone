/// <reference types="vite/client" />
type ProfileType = {
    id: string | number;
    username: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}
type ThreadType = {
    id: string | number;
    content?: string;
    picture?: string;
    isDeleted?: boolean;
    RepostedBy?: ProfileType;
    RepostTo?: ThreadType;
    QuotedBy?: ProfileType;
    QuoteTo?: ThreadType;
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
    Comments?: {
        id: string;
    }[];
    ChildThreads?: ThreadType[];
}
type BookmarkType = {
    id: string;
    ProfileId: string;
    ThreadId: string;
    createdAt: string;
    updatedAt: string;
    Thread: ThreadType;
}