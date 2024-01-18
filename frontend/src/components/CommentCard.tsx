import React from "react";
import {User, Link, DropdownItem, DropdownMenu, DropdownTrigger, Dropdown, Button, useDisclosure} from "@nextui-org/react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {FaRegComment} from "react-icons/fa";
import {BsThreeDots} from "react-icons/bs";
import { Link as RouterLink } from 'react-router-dom';
import CreateEditComment from "./CreateEditComment.tsx";
import {toast} from "react-toastify";
import Loader from "./Loader.tsx";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../app/features/userSlice.ts";
import {useGetAllRepliesQuery, useDeleteCommentMutation} from "../app/services/commentApi.ts";


type PropTypes = {
    comment: CommentType;
};
function CommentCard({comment}:PropTypes) {
    const dispatch = useDispatch();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);
    
    const [showReplies, setShowReplies] = React.useState<boolean>(false);

    const {isOpen:isCreateReplyOpen, onOpen: onCreateReplyOpen, onOpenChange: onCreateReplyOpenChange} = useDisclosure();

    const [allReplies, setAllReplies] = React.useState<CommentType[]>([]);

    const {data: allRepliesData, isLoading: allRepliesLoading} = useGetAllRepliesQuery(comment?.id);
    React.useEffect(() => {
        if (allRepliesData?.comments) {
            setAllReplies(allRepliesData?.comments);
        }
    }, [allRepliesData?.comments]);

    const {isOpen:isEditCommentOpen, onOpen: onEditCommentOpen, onOpenChange: onEditCommentOpenChange} = useDisclosure();

    const [deleteComment, {isLoading: isDeletingComment}] = useDeleteCommentMutation();

    const handleDeleteComment = async () => {
        try {
            const res = await deleteComment(comment?.id);
            console.log(res);
            dispatch(setUser({
                ...user,
                CreatedComments: user.CreatedComments.filter((comm:string) => comm !== comment?.id),
            }));
            toast.success("Comment deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            {(allRepliesLoading || isDeletingComment) && <Loader />}
            <div
                className="w-full"
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    padding: "10px",
                    border: "1px solid #bbbbbb",
                    marginBottom: "10px",
                    borderColor: "rgba(0, 0, 0, 0.4)",
                }}
            >
                <div className="flex flex-row justify-between">
                    <User
                        name={(
                            <Link
                                as={RouterLink}
                                to={`/@${comment?.Profile?.username}`}
                                size="md"
                            >
                                @{comment?.Profile?.username}
                            </Link>
                        )}
                        description={(
                            <p className="text-gray-50 text-xs">
                                {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    new Date(comment?.createdAt).toGMTString().slice(0, -7)
                                }
                            </p>
                        )}
                        avatarProps={{
                            src: comment?.Profile?.avatar,
                            alt: comment?.Profile?.username,
                        }}
                    />
                    {
                        (user.id === comment?.Profile?.UserId && !comment.isDeleted) && (
                            <>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button isIconOnly color="default" variant="light" aria-label="Three Dots">
                                            <BsThreeDots className="text-2xl text-gray-500 cursor-pointer"/>
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem key="edit" onClick={onEditCommentOpen}>Edit Comment</DropdownItem>
                                        <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleDeleteComment}>
                                            Delete Comment
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <CreateEditComment
                                    isOpen={isEditCommentOpen}
                                    onOpenChange={onEditCommentOpenChange}
                                    commentToEdit={comment}
                                />
                            </>
                        )
                    }
                </div>

                {
                    comment?.isDeleted ? (
                        <div className="flex flex-row justify-start mt-2" style={{
                            border: "1px solid #bbbbbb",
                            padding: "10px",
                            borderRadius: "10px",
                            borderColor: "rgba(0, 0, 0, 0.4)",
                            color: "rgba(0, 0, 0, 0.4)",
                        }}>
                            <p className="text-gray-50 text-xs">This comment has been deleted</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-row justify-start mt-2">
                                {comment?.content}
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "start",
                                width: "fit-content",
                                marginTop: "10px",
                            }}>
                                <AiFillHeart className="text-2xl text-red-500 cursor-pointer ml-2 icon"/>
                                <AiOutlineHeart className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
                                <FaRegComment className="text-2xl text-gray-500 cursor-pointer ml-2 icon"
                                              onClick={onCreateReplyOpen}/>
                            </div>
                            <CreateEditComment
                                isOpen={isCreateReplyOpen}
                                onOpenChange={onCreateReplyOpenChange}
                                comment={comment}
                            />
                        </>
                    )
                }

                <div className="flex flex-row justify-start mt-2">
                    <p className="text-gray-50 text-xs">{comment?.Likes?.length} likes</p>
                    <p className="text-gray-50 text-xs ml-2"
                       onClick={() => setShowReplies(!showReplies)}>{comment?.Children?.length} replies</p>
                </div>

                {
                    showReplies ? (
                        <div className="flex flex-col justify-start mt-2" style={{
                            maxWidth: "100%",
                            marginLeft: "12px",
                        }}>
                            {
                                allReplies?.map((reply) => (
                                    <CommentCard
                                        key={reply?.id}
                                        comment={reply}
                                    />
                                ))
                            }
                        </div>
                    ) : null
                }
            </div>
        </>
    );
}

export default CommentCard;