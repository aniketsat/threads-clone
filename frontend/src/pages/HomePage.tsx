import React from "react";
import PostCard from "../components/PostCard.tsx";
import Loader from "../components/Loader.tsx";
import { useGetAllThreadsQuery } from "../app/services/threadApi.ts";
import { useSelector } from "react-redux";


function HomePage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { data: threadsData, isLoading: threadsLoading, refetch: refetchThreads } = useGetAllThreadsQuery();

    const [allThreads, setAllThreads] = React.useState<ThreadType[]>([]);

    React.useEffect(() => {
        if(threadsData?.threads) {
            setAllThreads(threadsData?.threads);
        }
    }, [threadsData]);

    React.useEffect(() => {
        const reload = async () => {
            await refetchThreads();
        }
        reload();
    }, [user, refetchThreads]);

    return (
        <>
            {threadsLoading && <Loader/>}
            <div className="main-container w-full flex flex-col gap-4 mb-4">
                {
                    allThreads?.map((thread) => (
                        <PostCard
                            key={thread.id}
                            thread={thread}
                            allThreads={allThreads}
                            setAllThreads={setAllThreads}
                            child={
                                thread?.QuoteTo ? (
                                    <PostCard
                                        child={null}
                                        isChild={true}
                                        thread={thread.QuoteTo}
                                        allThreads={allThreads}
                                        setAllThreads={setAllThreads}
                                    />
                                ) : null
                            }
                        />
                    ))
                }
            </div>
        </>
    );
}

export default HomePage;