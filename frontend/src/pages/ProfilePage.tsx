import * as React from "react";
import {Avatar, Tabs, Tab, Button} from "@nextui-org/react";
import {useParams, useNavigate} from "react-router-dom";
import {useGetUserByUsernameQuery} from "../app/services/userApi.ts";
import Loader from "../components/Loader.tsx";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import EditProfileModal from "../components/EditProfileModal.tsx";


function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const navigate = useNavigate();

    const {username} = useParams<{username: string}>();

    const {data, error, isLoading, refetch} = useGetUserByUsernameQuery(username?.slice(1) || "");
    
    React.useEffect(() => {
        navigate(`/@${user?.username}`, {replace: true});
        refetch();
    }, [navigate, refetch, user]);

    if (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        toast.error(error?.data?.message || "Something went wrong");
        return null;
    }

    return (
        <>
            {isLoading && <Loader />}
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

                <div className="flex flex-col gap-1">
                    <p className="text-gray-400" style={{color: "gray"}}>0 Following</p>
                </div>

                {
                    data?.user?.id === user?.id ? (
                        <EditProfileModal />
                    ) : (
                        <div className="flex flex-row gap-1">
                            <Button className="w-full">
                                Follow
                            </Button>
                            <Button className="w-full">
                                Message
                            </Button>
                        </div>
                    )
                }


                <Tabs
                    fullWidth
                    className="w-full"
                    variant="underlined"
                    color="primary"
                >
                    <Tab title="Posts">
                        <p>Posts</p>
                    </Tab>
                    <Tab title="Replies">
                        <p>Replies</p>
                    </Tab>
                    <Tab title="Replies">
                        <p>Replies</p>
                    </Tab>
                </Tabs>

            </div>
        </>
    );
}

export default ProfilePage;