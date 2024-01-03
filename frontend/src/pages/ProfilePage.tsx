import {Avatar, AvatarIcon, Tabs, Tab, Button} from "@nextui-org/react";

function ProfilePage() {
    return (
        <div className="main-container w-full flex flex-col gap-4">
            <div className="flex flex-row justify-between gap-1 w-full">
                <div className="flex flex-col gap-1">
                    <h6 className="font-bold text-2xl" style={{
                        fontSize: "1.5rem",
                        fontStyle: "bold",
                        fontWeight: 600,
                    }}>Aniket Satapathy</h6>
                    <p className="text-gray-400">@aniketsatapathy</p>
                    <p className="text-gray-400">Joined May 2021</p>
                </div>
                <Avatar icon={<AvatarIcon />} size="lg" />
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-gray-400" style={{color:"gray"}}>0 Following</p>
            </div>

            <Button className="w-full">
                Edit Profile
            </Button>

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
    );
}

export default ProfilePage;