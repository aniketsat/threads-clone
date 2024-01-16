import * as React from "react";
import {Avatar, Tabs, Tab, Button, Divider} from "@nextui-org/react";
import {useParams, useNavigate} from "react-router-dom";
import {useGetUserByUsernameQuery} from "../app/services/userApi.ts";
import Loader from "../components/Loader.tsx";
import {toast} from "react-toastify";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../app/features/userSlice.ts";
import {useFollowUserMutation, useUnfollowUserMutation} from "../app/services/followApi.ts";
import EditProfileModal from "../components/EditProfileModal.tsx";
import FollowModal from "../components/FollowModal.tsx";
import Profile_Posts from "../components/Profile_Posts.tsx";
import Profile_Bookmarks from "../components/Profile_Bookmarks.tsx";
import Profile_Quotes from "../components/Profile_Quotes.tsx";
import Profile_Reposts from "../components/Profile_Reposts.tsx";


function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {username} = useParams<{username: string}>();

    const {data, error, isLoading, refetch} = useGetUserByUsernameQuery(username?.slice(1) || "");
    
    React.useEffect(() => {
        if (data?.user?.id === user?.id) {
            navigate(`/@${user?.username}`, {replace: true});
            refetch();
        }
    }, [data?.user?.id, navigate, refetch, user]);

    const [followUser, {isLoading: followLoading}] = useFollowUserMutation();
    const [unfollowUser, {isLoading: unfollowLoading}] = useUnfollowUserMutation();

    if (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        toast.error(error?.data?.message || "Something went wrong");
        return null;
    }

    const followHandler = async () => {
        if (!user) {
            toast.error("You need to login first");
            return;
        }
        if (user?.following?.includes(data?.user?.Profile?.id)) {
            unfollowUser(data?.user?.Profile?.id)
                .unwrap()
                .then((res) => {
                    toast.success(res?.message);
                    dispatch(setUser({
                        ...user,
                        following: user?.following?.filter((id:string) => id !== data?.user?.Profile?.id),
                    }));
                    refetch();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err?.data?.message || "Something went wrong");
                });
        } else {
            followUser(data?.user?.Profile?.id)
                .unwrap()
                .then((res) => {
                    toast.success(res?.message);
                    dispatch(setUser({
                        ...user,
                        following: [...user.following, data?.user?.Profile?.id],
                    }));
                    refetch();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err?.data?.message || "Something went wrong");
                });
        }
    }

    return (
        <>
            {(isLoading || followLoading || unfollowLoading) && <Loader />}
            <div className="main-container w-full flex flex-col gap-4">
                <div className="flex flex-row justify-between gap-1 w-full">
                    <div className="flex flex-col gap-1">
                        <h6 className="font-bold text-2xl" style={{
                            fontSize: "1.5rem",
                            fontStyle: "bold",
                            fontWeight: 600,
                        }}>{data?.user?.name}</h6>
                        <p className="text-gray-400">@{data?.user?.Profile?.username}</p>
                        <p className="text-gray-400" style={{color: "gray"}}>Joined {new Date(data?.user?.createdAt).toDateString().split(" ")[1]} {new Date(data?.user?.createdAt).toDateString().split(" ")[3]}</p>
                    </div>
                    <Avatar
                        isBordered
                        className="transition-transform"
                        color="primary"
                        name={data?.user?.Profile?.username}
                        size="lg"
                        src={data?.user?.Profile?.avatar}
                    />
                </div>

                {
                    data?.user?.Profile?.bio && (
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-400" >
                                {data?.user?.Profile?.bio}
                            </p>
                        </div>
                    )
                }

                <div className="flex flex-row flex-wrap gap-1 items-center justify-center">
                    <p className="text-gray-400" style={{color: "gray"}}>{data?.user?.followingCount} Following</p>
                    <p className="text-black">|</p>
                    <p className="text-gray-400" style={{color: "gray"}}>{data?.user?.followersCount} Followers</p>
                    {
                        (data?.user?.Profile?.profileType === "PUBLIC" || user?.following?.includes(data?.user?.Profile?.id)) && (
                            <FollowModal username={username?.slice(1) || ""}></FollowModal>
                        )
                    }

                </div>

                {
                    data?.user?.id === user?.id ? (
                        <EditProfileModal />
                    ) : (
                        <Button className="w-full" onClick={followHandler}>
                            {
                                user?.following?.includes(data?.user?.Profile?.id) ? "Unfollow" : "Follow"
                            }
                        </Button>
                    )
                }


                {
                    (data?.user?.Profile?.profileType === "PRIVATE" && data?.user?.id !== user?.id && !user?.following?.includes(data?.user?.Profile?.id)) ? (
                        <>
                            <Divider className="w-full" />
                            <p className="text-gray-400 text-center">This account is private</p>
                        </>
                    ) : (
                        <Tabs
                            fullWidth
                            className="w-full"
                            variant="underlined"
                            color="primary"
                        >
                            <Tab title="Posts">
                                <Profile_Posts username={username?.slice(1) || ""} />
                            </Tab>
                            <Tab title="Quotes">
                                <Profile_Quotes username={username?.slice(1) || ""} />
                            </Tab>
                            <Tab title="Reposts">
                                <Profile_Reposts username={username?.slice(1) || ""} />
                            </Tab>
                            <Tab title="Bookmarks">
                                <Profile_Bookmarks username={username?.slice(1) || ""} />
                            </Tab>
                        </Tabs>
                    )
                }

            </div>
        </>
    );
}

export default ProfilePage;