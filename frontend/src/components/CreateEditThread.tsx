import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Image
} from "@nextui-org/react";
import Loader from "./Loader.tsx";
import {useQuoteThreadMutation} from "../app/services/threadApi.ts";
import { useCreateThreadMutation, useUpdateThreadMutation } from "../app/services/threadApi.ts";
import {toast} from "react-toastify";
import {setUser} from "../app/features/userSlice.ts";
import {useDispatch, useSelector} from "react-redux";


type ThreadFormProps = {
    thread: ThreadType;
    setThreads: React.Dispatch<React.SetStateAction<ThreadType[]>>;
}
const ThreadForm = ({ thread, setThreads }: ThreadFormProps) => {
    const handleContentChange = (value: string) => {
        setThreads((prevThreads) => {
            const allThreads = [...prevThreads];
            const threadIndex = allThreads.findIndex((t) => t.id === thread.id);
            allThreads[threadIndex] = { ...allThreads[threadIndex], content: value };
            return allThreads;
        });
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <Textarea
                    isRequired
                    className="w-full"
                    placeholder="What's happening?"
                    style={{width: "100%"}}
                    rows={4}
                    value={thread?.content}
                    onValueChange={handleContentChange}
                />

                <div className="flex flex-row gap-4">
                    <Button
                        fullWidth={false}
                        style={{width: "fit-content"}}
                        color="success"
                        endContent={<CameraIcon
                            fill="currentColor"
                            className="w-5 h-5"
                        />}
                        onPress={() => {
                            document.getElementById(`thread-picture-${thread.id}`)?.click();
                        }}
                    >
                        Add Media
                    </Button>
                    <input
                        style={{display: "none"}}
                        id={`thread-picture-${thread.id}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setThreads((prev) => {
                                const newThreads = [...prev];
                                const threadIndex = newThreads.findIndex((t) => t.id === thread.id);
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                newThreads[threadIndex].picture = e.target.files[0];
                                return newThreads;
                            })
                        }}
                    />
                    <Button
                        fullWidth={false}
                        style={{
                            width: "fit-content",
                        }}
                        color="danger"
                        variant="flat"
                        disabled={!thread.picture}
                        onPress={() => {
                            setThreads((prev) => {
                                const newThreads = [...prev];
                                const threadIndex = newThreads.findIndex((t) => t.id === thread.id);
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                newThreads[threadIndex].picture = null;
                                return newThreads;
                            })
                        }}
                    >
                        Remove Media
                    </Button>
                </div>

                <Image
                    src={thread.picture ? typeof thread.picture === "string" ? thread.picture : URL.createObjectURL(thread.picture) : ""}
                    width={200}
                    height={200}
                    style={{
                        objectFit: "cover",
                        display: thread.picture ? "block" : "none",
                        borderRadius: "0.5rem",
                    }}
                />
            </div>
        </>
    );
};

type CreateEditThreadProps = {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: (open: boolean) => void;
    toBeUpdatedThread?: ThreadType;
    toBeRepostedThread?: ThreadType;
}
export default function CreateEditThread({isOpen, onOpen, onOpenChange, toBeUpdatedThread, toBeRepostedThread}: CreateEditThreadProps) {
    const [threads, setThreads] = React.useState<ThreadType[]>([]);
    React.useEffect(() => {
        if (toBeUpdatedThread) {
            setThreads([Object.assign({}, toBeUpdatedThread)]);
        } else {
            setThreads([
                {
                    id: Date.now(),
                }
            ]);
        }
    }, [onOpen, toBeUpdatedThread]);

    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const [quoteThread, {isLoading: isQuotingThread}] = useQuoteThreadMutation();

    const [createThread, {isLoading: isCreatingThread}] = useCreateThreadMutation();
    const [updateThread, {isLoading: isUpdatingThread}] = useUpdateThreadMutation();

    const handleCreateThread = async (onClose: () => void) => {
        for (let i = 0; i < threads.length; i++) {
            const thread = threads[i];
            const {content, picture} = thread;
            const formData = new FormData();
            formData.append("content", content || "");
            if (picture) {
                formData.append("picture", picture);
            }
            const res = await createThread(formData);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (res?.data && res?.data?.thread) {
                dispatch(setUser({
                    ...user,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    CreatedThreads: [...user.CreatedThreads, res.data.thread.id],
                }));
            } else {
                toast.error("Something went wrong");
                return;
            }
        }
        setThreads([
            {
                id: Date.now(),
            }
        ]);
        onClose();
    }

    const handleUpdateThread = async (onClose: () => void) => {
        const thread = threads[0];
        const formData = new FormData();
        formData.append("content", thread.content || "");
        if (thread.picture) {
            formData.append("picture", thread.picture);
        }
        try {
            const res = await updateThread({id: thread.id, data: formData});
            console.log(res);
            dispatch(setUser({
                ...user,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                CreatedThreads: user?.CreatedThreads?.filter((t: string) => t !== res.data.thread.id),
            }));
            dispatch(setUser({
                ...user,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                CreatedThreads: [...user.CreatedThreads, res.data.thread.id],
            }));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.success(res?.data?.message || "Thread updated successfully");
            onClose();
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    }

    const handleQuoteThread = async (onClose: () => void) => {
        const thread = threads[0];
        const formData = new FormData();
        formData.append("content", thread.content || "");
        if (thread.picture) {
            formData.append("picture", thread.picture);
        }
        try {
            const res = await quoteThread({id: toBeRepostedThread?.id || "", data: formData});
            console.log(res);
            dispatch(setUser({
                ...user,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                QuotedThreads: [...user.QuotedThreads, res.data.thread.QuoteToId],
            }));
            onClose();
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            {(isCreatingThread || isUpdatingThread || isQuotingThread) && <Loader/>}
            <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {
                                    toBeUpdatedThread ? (
                                        "Update Thread"
                                    ) : (
                                        <>
                                            {
                                                toBeRepostedThread ? (
                                                    "Quote Thread"
                                                ) : (
                                                    "Create a new Thread"
                                                )
                                            }
                                        </>
                                    )
                                }
                            </ModalHeader>
                            <ModalBody>
                                {
                                    threads.map((thread) => {
                                        return (
                                            <ThreadForm
                                                key={thread.id}
                                                thread={thread}
                                                setThreads={setThreads}
                                            />
                                        )
                                    })
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                {
                                    toBeUpdatedThread ? (
                                        <Button
                                            color="primary"
                                            variant="light"
                                            onPress={() => {
                                                handleUpdateThread(onClose);
                                            }}
                                            isLoading={isCreatingThread || isUpdatingThread || isQuotingThread}
                                            disabled={isCreatingThread || isUpdatingThread || isQuotingThread}
                                        >
                                            Update
                                        </Button>
                                    ) : (
                                        <>
                                            {
                                                toBeRepostedThread ? (
                                                    <Button
                                                        color="primary"
                                                        variant="light"
                                                        onPress={() => {
                                                            handleQuoteThread(onClose);
                                                        }}
                                                        isLoading={isCreatingThread || isUpdatingThread || isQuotingThread}
                                                        disabled={isCreatingThread || isUpdatingThread || isQuotingThread}
                                                    >
                                                        Quote
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        color="primary"
                                                        variant="light"
                                                        onPress={() => {
                                                            handleCreateThread(onClose);
                                                        }}
                                                        isLoading={isCreatingThread || isUpdatingThread || isQuotingThread}
                                                        disabled={isCreatingThread || isUpdatingThread || isQuotingThread}
                                                    >
                                                        Create
                                                    </Button>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

const CameraIcon = ({fill = 'currentColor', ...props}) => {
    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
                fill={fill}
            />
        </svg>
    );
};

