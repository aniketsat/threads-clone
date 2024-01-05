import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input, Image
} from "@nextui-org/react";
import Loader from "./Loader.tsx";
import { useUpdateCurrentUserMutation } from "../app/services/userApi.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../app/features/userSlice.ts";
import {toast} from "react-toastify";


export default function EditProfileModal() {
    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);
    
    const [updateCurrentUserMutation, {isLoading}] = useUpdateCurrentUserMutation();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [username, setUsername] = React.useState(user?.username);
    const [bio, setBio] = React.useState(user?.bio);
    const [avatar, setAvatar] = React.useState(user?.avatar);

    const handleUpdateProfile = (onClose: { (): void; (): void; }) => {
        const formDat = new FormData();
        formDat.append("username", username);
        formDat.append("bio", bio);
        formDat.append("avatar", avatar);
        updateCurrentUserMutation(formDat).unwrap()
            .then((res) => {
                toast.success(res.message);
                dispatch(setUser({
                    ...user,
                    username: res.user.username,
                    bio: res.user.bio,
                    avatar: res.user.avatar,
                }));
                onClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message || "Something went wrong");
            });
    }

    return (
        <>
            {isLoading && <Loader />}
            <Button onPress={onOpen} fullWidth>Edit Profile</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent className="w-full">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
                            <ModalBody className="w-full flex flex-col gap-4">
                                <Input
                                    label="Name"
                                    placeholder="Name"
                                    required
                                    disabled
                                    value={user.name}
                                />
                                <Input
                                    label="Username"
                                    placeholder="Username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Input
                                    label="Bio"
                                    placeholder="Bio"
                                    required
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                                <Button
                                    color="primary"
                                    variant="light"
                                    onPress={() => {
                                        document.getElementById("avatar")?.click();
                                    }}
                                >
                                    Upload Avatar
                                </Button>
                                <input
                                    type="file"
                                    id="avatar"
                                    className="hidden"
                                    onChange={(e) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-expect-error
                                        setAvatar(e.target.files[0]);
                                    }}
                                />
                                <Image
                                    src={avatar && typeof avatar === "string" ? avatar :
                                        avatar && typeof avatar === "object" ? URL.createObjectURL(avatar) :
                                            user.avatar
                                    }
                                    width={120}
                                    height={120}
                                    className="bg-cover bg-center"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={() => {
                                    handleUpdateProfile(onClose);
                                }}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
