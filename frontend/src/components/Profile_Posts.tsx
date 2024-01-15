import React from "react";
import Loader from "./Loader.tsx";
import {useGetThreadsByUserQuery} from "../app/services/threadApi.ts";
import PostCard from "./PostCard.tsx";


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
    }, [refetch, username]);

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
                        <PostCard child={null} allThreads={allThreads} setAllThreads={setAllThreads} thread={thread} key={thread.id} />
                    ))
                }
            </div>
        </>
    );
}

export default ProfilePosts;