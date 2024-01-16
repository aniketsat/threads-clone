import React from 'react';
import {useGetQuotesByUserQuery} from "../app/services/threadApi.ts";
import {useSelector} from "react-redux";
import Loader from "./Loader.tsx";
import PostCard from "./PostCard.tsx";

type PropType = {
    username: string;
};
function ProfileQuotes({username}: PropType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const [allThreads, setAllThreads] = React.useState<ThreadType[]>([]);

    const {data, isLoading, refetch} = useGetQuotesByUserQuery(username);

    React.useEffect(() => {
        if (data?.threads) {
            setAllThreads(data?.threads);
        }
    }, [data?.threads]);

    React.useEffect(() => {
        const refetchData = async () => {
            await refetch();
        }
        refetchData();

        return () => {
            setAllThreads([]);
        }
    }, [refetch, username, user?.QuotedThreads]);

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full">
                {
                    allThreads && allThreads?.length === 0 && (
                        <div className="w-full flex justify-center items-center">
                            <h1 className="text-xl font-semibold">No Quotes</h1>
                        </div>
                    )
                }
                {
                    allThreads?.map((thread: ThreadType) => (
                        <PostCard
                            child={thread?.QuoteTo ?
                                <PostCard
                                    isChild={true}
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

export default ProfileQuotes;