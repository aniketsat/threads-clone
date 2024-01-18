import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea} from "@nextui-org/react";
import Loader from "./Loader.tsx";
import {useCreateCommentMutation, useCreateReplyMutation, useUpdateCommentMutation} from "../app/services/commentApi.ts";
import {toast} from "react-toastify";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../app/features/userSlice.ts";


type PropTypes = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    thread?: ThreadType;
    comment?: CommentType;
    commentToEdit?: CommentType;
};
function CreateEditComment({isOpen, onOpenChange, thread, comment, commentToEdit}: PropTypes) {
    const dispatch = useDispatch();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const [commentText, setCommentText] = React.useState<string>(commentToEdit ? commentToEdit?.content : "");

    const [createComment, {isLoading: isCreatingComment}] = useCreateCommentMutation();

    const handleCreateComment = async (onClose: () => void) => {
        try {
            const res = await createComment({
                threadId: thread?.id,
                content: commentText,
            });
            toast.success("Comment created successfully");
            setCommentText("");
            dispatch(setUser({
                ...user,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                CreatedComments: [...user.CreatedComments, res?.data?.comment?.id]
            }));
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const [createReply, {isLoading: isCreatingReply}] = useCreateReplyMutation();

    const handleCreateReply = async (onClose: () => void) => {
        try {
            const res = await createReply({
                commentId: comment?.id,
                content: commentText,
            });
            toast.success("Reply created successfully");
            setCommentText("");
            dispatch(setUser({
                ...user,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                CreatedComments: [...user.CreatedComments, res?.data?.comment?.id]
            }));
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const [updateComment, {isLoading: isUpdatingComment}] = useUpdateCommentMutation();

    const handleUpdateComment = async (onClose: () => void) => {
        try {
            const res = await updateComment({
                commentId: commentToEdit?.id,
                content: commentText,
            });
            console.log(res);
            toast.success("Comment updated successfully");
            setCommentText("");
            // Remove the comment from the user's created comments
            dispatch(setUser({
                ...user,
                CreatedComments: user.CreatedComments.filter((comm:string) => comm !== commentToEdit?.id)
            }));
            dispatch(setUser({
                ...user,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                CreatedComments: [...user.CreatedComments, res?.data?.comment?.id]
            }));
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            {(isCreatingComment || isCreatingReply || isUpdatingComment) && <Loader />}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {
                                    commentToEdit ? (
                                        "Edit Comment"
                                    ) : (
                                        thread ? (
                                            "Create Comment"
                                        ) : (
                                            "Create Reply"
                                        )
                                    )
                                }
                            </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    placeholder="Write your comment here..."
                                    width="100%"
                                    height="100px"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    isLoading={isCreatingComment || isCreatingReply || isUpdatingComment}
                                    disabled={isCreatingComment || isCreatingReply || isUpdatingComment}
                                    onPress={() => {
                                        if (thread) {
                                            handleCreateComment(onClose);
                                        } else if (comment) {
                                            handleCreateReply(onClose);
                                        } else {
                                            handleUpdateComment(onClose);
                                        }
                                    }}
                                >
                                    {
                                        commentToEdit ? (
                                            "Update"
                                        ) : (
                                            "Create"
                                        )
                                    }
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default CreateEditComment;