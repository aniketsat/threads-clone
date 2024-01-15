import React from 'react';
import {
    User,
    Link,
    Image,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    useDisclosure,
    Button
} from "@nextui-org/react";
import {Link as RouterLink} from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../app/features/userSlice.ts";
import CreateEditThread from "./CreateEditThread.tsx";
import DeleteThreadModal from "./DeleteThreadModal.tsx";
import {useLikePostMutation, useUnlikePostMutation} from "../app/services/likeApi.ts";
import {useCreateBookmarkMutation, useDeleteBookmarkMutation} from "../app/services/bookmarkApi.ts";
import Loader from "./Loader.tsx";
import {toast} from "react-toastify";

type PropType = {
    child: React.ReactNode;
    thread?: ThreadType;
    allThreads: ThreadType[];
    setAllThreads: React.Dispatch<React.SetStateAction<ThreadType[]>>;
    isChild?: boolean;
};
function PostCard( { child, thread, allThreads, setAllThreads, isChild }:PropType) {
    const {isOpen:isCreateEditThreadModalOpen, onOpen: onCreateEditThreadModalOpen, onOpenChange: onCreateEditThreadModalOpenChange} = useDisclosure();
    const {isOpen:isDeleteThreadModalOpen, onOpen: onDeleteThreadModalOpen, onOpenChange: onDeleteThreadModalOpenChange} = useDisclosure();

    const dispatch = useDispatch();

    const [likePost, { isLoading: isLikeLoading }] = useLikePostMutation();
    const [unlikePost, { isLoading: isUnlikeLoading }] = useUnlikePostMutation();

    const [createBookmark, { isLoading: isCreateBookmarkLoading }] = useCreateBookmarkMutation();
    const [deleteBookmark, { isLoading: isDeleteBookmarkLoading }] = useDeleteBookmarkMutation();

    const handleLike = () => {
        likePost(thread?.id as string)
            .unwrap()
            .then((data) => {
                console.log(data);
                const index = allThreads.findIndex((thread) => thread.id === data?.like?.ThreadId);
                const updatedThread = {
                    ...allThreads[index],
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Likes: [...allThreads[index].Likes, data?.like],
                };
                const updatedThreads = [...allThreads];
                updatedThreads[index] = updatedThread;
                setAllThreads(updatedThreads);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleUnlike = () => {
        unlikePost(thread?.id as string)
            .unwrap()
            .then((data) => {
                console.log(data);
                const index = allThreads.findIndex((thread) => thread.id === data?.like?.ThreadId);
                const updatedThread = {
                    ...allThreads[index],
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Likes: allThreads[index].Likes.filter((like) => like.id !== data?.like?.id),
                };
                const updatedThreads = [...allThreads];
                updatedThreads[index] = updatedThread;
                setAllThreads(updatedThreads);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleCreateBookmark = () => {
        createBookmark(thread?.id as string)
            .unwrap()
            .then((data) => {
                console.log(data);
                toast.success(data?.message || "Bookmark created successfully");
                dispatch(setUser({
                    ...user,
                    BookmarkedThreads: [...user.BookmarkedThreads, thread?.id],
                }));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    const handleDeleteBookmark = () => {
        deleteBookmark(thread?.id as string)
            .unwrap()
            .then((data) => {
                console.log(data);
                toast.success(data?.message || "Bookmark deleted successfully");
                dispatch(setUser({
                    ...user,
                    BookmarkedThreads: user?.BookmarkedThreads?.filter((threadId: string) => threadId !== thread?.id),
                }));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    return (
        <>
            {(isLikeLoading || isUnlikeLoading || isCreateBookmarkLoading || isDeleteBookmarkLoading) && <Loader />}
            <div className="p-2" style={{border: "1px solid #eaeaea", borderRadius: "8px", marginTop: 0, width:"100%"}}>
                {
                    isChild && (
                        <p className="text-gray-50 text-xs" style={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            marginBottom: "0.25rem",
                        }}>Aniket Reposted</p>
                    )
                }

                <div className="flex flex-row items-center justify-between">
                    <User
                        name={<Link
                            as={RouterLink}
                            to={`/@${thread?.Creator?.username}`}
                            size="sm"
                            style={{
                                fontSize: "1.05rem",
                                fontWeight: 700,
                            }}>
                                @{thread?.Creator?.username}
                            </Link>}
                        description={(
                            <p className="text-gray-50 text-xs">
                                {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    new Date(thread?.createdAt as string).toGMTString().slice(0, -7)
                                }
                            </p>
                        )}
                        avatarProps={{
                            src: thread?.Creator?.avatar,
                            alt: thread?.Creator?.username,
                        }}
                    />
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly color="default" variant="light" aria-label="Three Dots">
                                <BsThreeDots className="text-2xl text-gray-500 cursor-pointer"/>
                            </Button>
                        </DropdownTrigger>
                        {
                            user?.id === thread?.Creator?.UserId ? (
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem
                                        key="bookmark"
                                        onClick={() => {
                                            if (user?.BookmarkedThreads?.includes(thread?.id)) {
                                                handleDeleteBookmark();
                                            } else {
                                                handleCreateBookmark();
                                            }
                                        }}
                                    >{
                                        user?.BookmarkedThreads?.includes(thread?.id) ? (
                                            "Unbookmark"
                                        ) : (
                                            "Bookmark"
                                        )
                                    }</DropdownItem>
                                    <DropdownItem
                                        key="edit"
                                        onClick={() => {
                                            onCreateEditThreadModalOpen();
                                        }}
                                    >
                                        Edit Thread
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        onClick={() => {
                                            onDeleteThreadModalOpen();
                                        }}
                                    >
                                        Delete Thread
                                    </DropdownItem>
                                </DropdownMenu>
                            ) : (
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="follow">Follow</DropdownItem>
                                    <DropdownItem key="bookmark">Bookmark</DropdownItem>
                                </DropdownMenu>
                            )
                        }
                    </Dropdown>
                    <CreateEditThread
                        isOpen={isCreateEditThreadModalOpen}
                        onOpen={onCreateEditThreadModalOpen}
                        onOpenChange={onCreateEditThreadModalOpenChange}
                        toBeUpdatedThread={thread}
                    />
                    <DeleteThreadModal
                        isOpen={isDeleteThreadModalOpen}
                        onOpen={onDeleteThreadModalOpen}
                        onOpenChange={onDeleteThreadModalOpenChange}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        thread={thread}
                    />
                </div>

                {
                    thread?.content && (
                        <p className="text-gray-50 text-sm mt-2">
                            {thread?.content}
                        </p>
                    )
                }

                {
                    thread?.picture && (
                        <Image
                            src={thread?.picture}
                            width="100%"
                            height="auto"
                            className="mt-2"
                        />
                    )
                }

                <div className="mt-2 ml-2">
                    {child}
                </div>

                {
                    isChild ? null : (
                        <div className="flex flex-row justify-between mt-2">
                            <div className="flex flex-row items-center justify-center">
                                {
                                    thread?.Likes?.find((like) => like.ProfileId === user?.profileId) ? (
                                        <AiFillHeart className="text-2xl text-red-500 cursor-pointer ml-2 icon" onClick={handleUnlike}/>
                                    ) : (
                                        <AiOutlineHeart className="text-2xl text-gray-500 cursor-pointer ml-2 icon" onClick={handleLike}/>
                                    )
                                }
                                <FaRegComment className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
                                <AiOutlineShareAlt className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
                            </div>
                            <div className="flex flex-row items-center">
                                <BiRepost className="text-2xl text-gray-500 cursor-pointer icon"/>
                            </div>
                        </div>
                    )
                }

                <div className="flex flex-row justify-start mt-2">
                    <p className="text-gray-50 text-xs">{thread?.Likes?.length} likes</p>
                    <p className="text-gray-50 text-xs ml-2">{thread?.Comments?.length} comments</p>
                </div>
            </div>
        </>
    );
}

export default PostCard;