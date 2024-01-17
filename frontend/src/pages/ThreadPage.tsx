import React from "react";
import { useParams } from 'react-router-dom';
import {useGetThreadQuery} from "../app/services/threadApi.ts";
import Loader from "../components/Loader.tsx";
import PostCard from "../components/PostCard.tsx";

function ThreadPage() {
    const [id, setId] = React.useState("");
    const [allThreads, setAllThreads] = React.useState<ThreadType[]>([]);

    const { threadId } = useParams();

    React.useEffect(() => {
        setId(threadId as string);
    }, [threadId]);

    const {data,  isLoading} = useGetThreadQuery(id);
    React.useEffect(() => {
        if (data?.thread) {
            setAllThreads([]);
            setAllThreads((prev) => [...prev, data?.thread]);
        }
    }, [data?.thread]);

    return (
        <>
            {isLoading && <Loader />}
            <div className="main-container w-full flex flex-col gap-4">
                {
                    allThreads?.map((thread) => (
                        <PostCard
                            key={thread.id}
                            thread={thread}
                            allThreads={allThreads}
                            setAllThreads={setAllThreads}
                            child={thread?.QuoteTo ? (
                                <PostCard
                                    key={thread?.QuoteTo?.id}
                                    thread={thread?.QuoteTo}
                                    allThreads={allThreads}
                                    setAllThreads={setAllThreads}
                                    child={null}
                                    isChild={true}
                                />
                            ) : null}
                        />
                    ))
                }
            </div>
        </>
    );
}

export default ThreadPage;