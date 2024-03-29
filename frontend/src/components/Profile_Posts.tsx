import React from "react";
import Loader from "./Loader.tsx";
import {useGetThreadsByUserQuery} from "../app/services/threadApi.ts";
import PostCard from "./PostCard.tsx";
import {user} from "@nextui-org/react";


type PropType = {
    username: string;
};
function ProfilePosts({username}: PropType) {
    const [allThreads, setAllThreads] = React.useState<ThreadType[]>([]);

    const {data, isLoading, refetch} = useGetThreadsByUserQuery(username);

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
    }, [refetch, username, user]);

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full" style={{ width: "100%" }}>
                {
                    allThreads && allThreads?.length === 0 && (
                        <div className="w-full flex justify-center items-center">
                            <h1 className="text-xl font-semibold">No Posts</h1>
                        </div>
                    )
                }
                {
                    allThreads?.map((thread: ThreadType) => (
                        <PostCard
                            child={
                                thread?.QuoteTo ?
                                <PostCard
                                    isChild={true}
                                    thread={thread?.QuoteTo}
                                    allThreads={allThreads}
                                    setAllThreads={setAllThreads}
                                    key={thread?.QuoteTo.id}
                                    child={null}
                                />
                                : null
                            }
                            allThreads={allThreads}
                            setAllThreads={setAllThreads}
                            thread={thread}
                            key={thread.id}
                        />
                    ))
                }
            </div>
        </>
    );
}

export default ProfilePosts;