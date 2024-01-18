import React from "react";
import { useParams } from 'react-router-dom';
import {Button, useDisclosure} from "@nextui-org/react";
import PostCard from "../components/PostCard.tsx";
import CommentCard from "../components/CommentCard.tsx";
import CreateEditComment from "../components/CreateEditComment.tsx";
import {useGetThreadQuery} from "../app/services/threadApi.ts";
import {useGetAllCommentsQuery} from "../app/services/commentApi.ts";
import Loader from "../components/Loader.tsx";
import {useSelector} from "react-redux";


function ThreadPage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);
    
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

    const {isOpen:isCreateCommentOpen, onOpen: onCreateCommentOpen, onOpenChange: onCreateCommentOpenChange} = useDisclosure();

    const [allComments, setAllComments] = React.useState<CommentType[]>([]);

    const {data: allCommentsData, isLoading: allCommentsLoading, refetch} = useGetAllCommentsQuery(id);
    React.useEffect(() => {
        if (allCommentsData?.comments) {
            let comms = allCommentsData?.comments;
            comms = comms.filter((comm:CommentType) => !comm?.ParentId);
            setAllComments(comms);
        }
    }, [allCommentsData?.comments]);
    
    React.useEffect(() => {
        const reload = async () => {
            await refetch();
        }
        reload();
    }, [refetch, user.CreatedComments, user]);

    return (
        <>
            {(isLoading || allCommentsLoading) && <Loader />}
            <div className="main-container w-full flex flex-col gap-4">
                <>
                    {
                        allThreads?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-2xl font-bold">No thread found</h1>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )
                    }
                </>


                <div className="w-full">
                    <div className="flex flex-row justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold" style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}>Comments</h1>
                        <Button
                            size="sm"
                            variant="bordered"
                            className="bg-gray-800 text-gray-50"
                            onClick={onCreateCommentOpen}
                        >
                            New Comment
                        </Button>
                    </div>
                    <CreateEditComment
                        isOpen={isCreateCommentOpen}
                        onOpenChange={onCreateCommentOpenChange}
                        thread={allThreads[0]}
                    />

                    {
                        allComments?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-2xl font-bold">No comments found</h1>
                            </div>
                        ) : (
                            <>
                                {
                                    allComments?.map((comm) => (
                                        <CommentCard
                                            key={comm.id}
                                            comment={comm}
                                        />
                                    ))
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default ThreadPage;