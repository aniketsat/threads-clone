import React from "react";
import PostCard from "../components/PostCard.tsx";
import Loader from "../components/Loader.tsx";
import { useGetAllThreadsQuery } from "../app/services/threadApi.ts";
import {Button} from "@nextui-org/react";
import {useSelector} from "react-redux";


function HomePage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const [page, setPage] = React.useState(1);
    const { data: threadsData, isLoading: threadsLoading, refetch: refetchThreads } = useGetAllThreadsQuery(page);

    const [allThreads, setAllThreads] = React.useState<ThreadType[]>(threadsData?.results || []);

    React.useEffect (() => {
        const reload = async () => {
            console.log("useEffect 2 called");
            await refetchThreads();
        }
        reload().then(r => console.log(r));
    }, [page, refetchThreads]);

    // Whenever the user changes, we need to reload the threads
    React.useEffect(() => {
        const reload = async () => {
            console.log("useEffect 3 called");
            await refetchThreads();
        }
        setAllThreads([]);
        setPage(1);
        reload().then(r => console.log(r));
    }, [user, refetchThreads]);

    React.useEffect(() => {
        console.log("useEffect 1 called");
        if (threadsData?.results) {
            setAllThreads((prev: ThreadType[]) => {
                return [...prev, ...threadsData.results];
            });
        }
    }, [threadsData?.results, setAllThreads]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    }

    return (
        <>
            {threadsLoading && <Loader/>}
            <div className="main-container w-full flex flex-col gap-4 mb-4">
                {
                    allThreads?.map((thread) => (
                        <PostCard
                            key={thread.id}
                            thread={thread}
                            child={
                                thread?.RepostTo ? (
                                    <PostCard
                                        child={null}
                                        isChild={true}
                                        thread={thread.RepostTo}
                                    />
                                ) : null
                            }
                        />
                    ))
                }
                {
                    threadsData?.count > allThreads?.length ? (
                        <Button
                            color="primary"
                            className="w-full"
                            variant="bordered"
                            style={{
                                borderRadius: "8px",
                            }}
                            onPress={handleLoadMore}
                            isLoading={threadsLoading}
                        >
                            Load More
                        </Button>
                    ) : (
                        <p className="text-gray-50 text-center">No more posts to show.</p>
                    )
                }
            </div>
        </>
    );
}

export default HomePage;