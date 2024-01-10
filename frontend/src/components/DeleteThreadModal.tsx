import {Button, cn, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import Loader from "./Loader.tsx";
import {toast} from "react-toastify";
import {setUser} from "../app/features/userSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useDeleteThreadMutation} from "../app/services/threadApi.ts";


type CreateEditThreadProps = {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: (open: boolean) => void;
    thread: ThreadType;
}
function DeleteThreadModal({isOpen, onOpen, onOpenChange, thread}: CreateEditThreadProps) {
    const dispatch = useDispatch();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);
    
    const [deleteThread, {isLoading}] = useDeleteThreadMutation();

    const handleDeleteThread = (onClose: { (): void; (): void; }) => {
        console.log(onOpen);
        deleteThread(thread.id)
            .unwrap()
            .then((res) => {
                toast.success(res.message);
                dispatch(setUser({
                    ...user,
                    threads: user?.CreatedThreads?.filter((t: { id: string | number; }) => t.id !== thread.id),
                }));
                onClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.data.message || "Something went wrong!");
            });
    }

    return (
        <>
            {isLoading && <Loader/>}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Delete Thread
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-default-400 text-center">
                                    Are you sure you want to delete this thread?
                                </p>
                                <p className={cn("text-default-400 text-center", "text-tiny")}>
                                    Deleting this thread will remove all your posts and comments and also all the reposts of this thread. This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={
                                    () => {
                                        handleDeleteThread(onClose);
                                    }
                                }>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default DeleteThreadModal;