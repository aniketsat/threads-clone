import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Listbox, ListboxItem, Avatar
} from "@nextui-org/react";
import {Tabs, Tab} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
import {setUser} from "../app/features/userSlice.ts";
import {useSelector, useDispatch} from "react-redux";
import { useGetFollowersByUsernameQuery, useGetFollowingByUsernameQuery, useFollowUserMutation, useUnfollowUserMutation } from "../app/services/followApi.ts";
import Loader from "./Loader.tsx";
import React from "react";
import {toast} from "react-toastify";

export default function FollowModal({username}: {username: string}) {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const {data: followersData, isLoading: followersLoading, refetch: refetchFollowers} = useGetFollowersByUsernameQuery(username);
    const {data: followingData, isLoading: followingLoading, refetch: refetchFollowings} = useGetFollowingByUsernameQuery(username);

    const [followUser, {isLoading: followLoading}] = useFollowUserMutation();
    const [unfollowUser, {isLoading: unfollowLoading}] = useUnfollowUserMutation();

    React.useEffect(() => {
        refetchFollowers();
        refetchFollowings();
    }, [user, refetchFollowers, refetchFollowings]);

    const followHandler = async (id: string) => {
        console.log(id);
        if(user?.following?.includes(id)) {
            unfollowUser(id)
                .unwrap()
                .then((res) => {
                    console.log(res);
                    toast.success(res?.message);
                    dispatch(setUser({
                        ...user,
                        following: user?.following?.filter((id:string) => id !== id),
                    }));
                    refetchFollowers();
                    refetchFollowings();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err?.data?.message || "Something went wrong");
                });
        } else {
            followUser(id)
                .unwrap()
                .then((res) => {
                    console.log(res);
                    toast.success(res?.message);
                    dispatch(setUser({
                        ...user,
                        following: [...user.following, id],
                    }));
                    refetchFollowers();
                    refetchFollowings();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err?.data?.message || "Something went wrong");
                });
        }
    }

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            {(followersLoading || followingLoading || followLoading || unfollowLoading) && <Loader />}
            <Button size="sm" onPress={onOpen} color="secondary">View</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Follows
                            </ModalHeader>
                            <ModalBody>
                                <Tabs
                                    aria-label="follow modal tabs"
                                    fullWidth
                                >
                                    <Tab key="Followers" title="Followers">
                                        <Listbox
                                            aria-label="followers list"
                                            className="w-full"
                                            shouldHighlightOnFocus={false}
                                            emptyContent="No followers yet"
                                        >
                                            {
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-expect-error
                                                followersData?.followers?.map((follower) => (
                                                    <ListboxItem
                                                        key={follower?.id}
                                                        isReadOnly={false}
                                                        startContent={<Avatar
                                                            src={follower?.avatar}
                                                            alt={`${follower?.username}`}
                                                            size="sm"
                                                            className="mr-2"
                                                        />}
                                                        endContent={
                                                            user?.id === follower?.UserId ? null : (
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    radius="sm"
                                                                    variant="bordered"
                                                                    onClick={() => followHandler(follower?.id)}
                                                                >
                                                                    {
                                                                        user?.following?.includes(follower?.id) ? "Unfollow" : "Follow"
                                                                    }
                                                                </Button>
                                                            )
                                                        }
                                                        onPress={() => {
                                                            navigate(`/@${follower?.username}`, {replace: true});
                                                            onClose();
                                                        }}
                                                    >
                                                        <p className="text-black" style={{fontWeight:"bold"}}>@{follower?.username}</p>
                                                        <p className="text-gray-400" style={{color:"grey"}}>{follower?.name}</p>
                                                    </ListboxItem>
                                                ))
                                            }

                                        </Listbox>
                                    </Tab>
                                    <Tab key="Followings" title="Followings">
                                        <Listbox
                                            aria-label="followers list"
                                            className="w-full"
                                            shouldHighlightOnFocus={false}
                                            emptyContent="You are not following anyone"
                                        >
                                            {
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-expect-error
                                                followingData?.following?.map((folloee) => (
                                                    <ListboxItem
                                                        key={folloee?.id}
                                                        isReadOnly={false}
                                                        startContent={<Avatar
                                                            src={folloee?.avatar}
                                                            alt={`${folloee?.username}`}
                                                            size="sm"
                                                            className="mr-2"
                                                        />}
                                                        endContent={
                                                            user?.id === folloee?.UserId ? null : (
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    radius="sm"
                                                                    variant="bordered"
                                                                    onClick={() => followHandler(folloee?.id)}
                                                                >
                                                                    {
                                                                        user?.following?.includes(folloee?.id) ? "Unfollow" : "Follow"
                                                                    }
                                                                </Button>
                                                            )
                                                        }
                                                        onPress={() => {
                                                            navigate(`/@${folloee?.username}`, {replace: true});
                                                            onClose();
                                                        }}
                                                    >
                                                        <p className="text-black" style={{fontWeight:"bold"}}>@{folloee?.username}</p>
                                                        <p className="text-gray-400" style={{color:"grey"}}>{folloee?.name}</p>
                                                    </ListboxItem>
                                                ))
                                            }

                                        </Listbox>
                                    </Tab>
                                </Tabs>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
