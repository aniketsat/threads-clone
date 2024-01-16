import React from 'react';
import {useGetBookmarkByUserQuery} from "../app/services/bookmarkApi.ts";
import {useSelector} from "react-redux";
import Loader from "./Loader.tsx";
import PostCard from "./PostCard.tsx";


type PropType = {
    username: string;
};
function ProfileBookmarks({username}: PropType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const [allThreads, setAllThreads] = React.useState<ThreadType[]>([]);

    const {data, isLoading, refetch} = useGetBookmarkByUserQuery(username);

    React.useEffect(() => {
        if (data?.bookmarks) {
            let threads = data?.bookmarks.map((bookmark: BookmarkType) => bookmark.Thread);
            threads = threads.filter((thread: ThreadType) => thread.isDeleted === false);
            setAllThreads(threads);
        }
    }, [data?.bookmarks]);

    React.useEffect(() => {
        const refetchData = async () => {
            await refetch();
        }
        refetchData();

        return () => {
            setAllThreads([]);
        }
    }, [refetch, username, user?.BookmarkedThreads]);

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full">
                {
                    allThreads && allThreads?.length === 0 && (
                        <div className="w-full flex justify-center items-center">
                            <h1 className="text-xl font-semibold">No Bookmarks</h1>
                        </div>
                    )
                }
                {
                    allThreads?.map((thread: ThreadType) => (
                        <PostCard
                            child={thread?.QuoteTo ?
                                <PostCard
                                    thread={thread?.QuoteTo}
                                    allThreads={allThreads}
                                    setAllThreads={setAllThreads}
                                    key={thread?.QuoteTo.id}
                                    child={null}
                                />
                                : null}
                            allThreads={allThreads}
                            setAllThreads={setAllThreads}
                            thread={thread}
                            key={thread.id} />
                    ))
                }
            </div>
        </>
    );
}

export default ProfileBookmarks;