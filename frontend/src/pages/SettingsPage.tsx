import * as React from "react";
import {Switch, cn, Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import PasswordInput from "../components/PasswordInput";

function SettingsPage() {
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    return (
        <div className="main-container w-full flex flex-col gap-4">
            <h1 className="text-9xl font-semibold" style={{fontSize:"1.5rem"}}>Settings</h1>

            <div className="flex flex-col gap-4 w-full">
                <Switch
                    className="w-full"
                    classNames={{
                        base: cn(
                            "w-full inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                            "data-[selected=true]:border-primary",
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            //selected
                            "group-data-[selected=true]:ml-6",
                            // pressed
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4",
                        ),
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium">Private Profile</p>
                        <p className="text-tiny text-default-400">
                            Get access to new features before they are released.
                        </p>
                    </div>
                </Switch>

                <Card
                    fullWidth
                    className="w-full p-6 m-auto"
                    shadow="none"
                >
                    <CardHeader>
                        <p className="text-2xl font-semibold">Change Password</p>
                    </CardHeader>
                    <CardBody style={{width:"100%"}} className="w-full flex flex-col gap-2">
                        <PasswordInput label="Current Password" placeholder="Enter your current password" value={currentPassword} setValue={setCurrentPassword} />
                        <PasswordInput label="New Password" placeholder="Enter your new password" value={newPassword} setValue={setNewPassword} />
                        <PasswordInput label="Confirm Password" placeholder="Confirm your new password" value={confirmPassword} setValue={setConfirmPassword} />
                        <Button color="primary" className="w-full">
                            Change Password
                        </Button>
                    </CardBody>
                </Card>
            </div>

            <Button color="danger" className="w-full">
                Delete Account
            </Button>
        </div>
    );
}

export default SettingsPage;