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
import { useSelector } from "react-redux";
import CreateEditThread from "./CreateEditThread.tsx";
import DeleteThreadModal from "./DeleteThreadModal.tsx";

type PropType = {
    child: React.ReactNode;
    thread?: ThreadType;
    isChild?: boolean;
};
function PostCard( { child, thread, isChild }:PropType) {
    const {isOpen:isCreateEditThreadModalOpen, onOpen: onCreateEditThreadModalOpen, onOpenChange: onCreateEditThreadModalOpenChange} = useDisclosure();
    const {isOpen:isDeleteThreadModalOpen, onOpen: onDeleteThreadModalOpen, onOpenChange: onDeleteThreadModalOpenChange} = useDisclosure();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    return (
        <>
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
                                    <DropdownItem key="bookmark">Bookmark</DropdownItem>
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
                                <AiFillHeart className="text-2xl text-gray-500 cursor-pointer icon"/>
                                <AiOutlineHeart className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
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
                    <p className="text-gray-50 text-xs ml-2">{thread?.ChildThreads?.length} comments</p>
                </div>
            </div>
        </>
    );
}

export default PostCard;