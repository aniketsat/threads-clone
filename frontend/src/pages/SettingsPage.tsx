import * as React from "react";
import {Switch, cn, Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import PasswordInput from "../components/PasswordInput";
import {toast} from "react-toastify";
import Loader from "../components/Loader.tsx";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../app/features/userSlice.ts";
import { useUpdatePasswordMutation, useChangeProfileTypeMutation } from "../app/services/userApi.ts";

function SettingsPage() {
    const dispatch = useDispatch();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);
    
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [profileType, setProfileType] = React.useState<"PUBLIC" | "PRIVATE">(user?.profileType || "PUBLIC");

    const [updatePassword, { isLoading: isUpdatePasswordLoading }] = useUpdatePasswordMutation();
    const [changeProfileType, { isLoading: isChangeProfileTypeLoading }] = useChangeProfileTypeMutation();

    const handleUpdatePassword = () => {
        if (!currentPassword) {
            toast.error("Please enter your current password!");
            return;
        }
        if (!newPassword) {
            toast.error("Please enter your new password!");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        updatePassword({
            oldPassword: currentPassword,
            newPassword,
        }).unwrap()
        .then(() => {
            toast.success("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        })
        .catch((err) => {
            console.log(err);
            toast.error(err?.data?.message || "Something went wrong!");
        });
    }

    const handleChangeVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.checked);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        changeProfileType()
            .unwrap()
            .then((res) => {
                toast.success(res?.message || "Profile type changed successfully!");
                dispatch(setUser({
                    ...user,
                    profileType: profileType === "PRIVATE" ? "PUBLIC" : "PRIVATE",
                }));
                setProfileType(profileType === "PRIVATE" ? "PUBLIC" : "PRIVATE");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message || "Something went wrong!");
            });
    }

    return (
        <>
            {(isUpdatePasswordLoading || isChangeProfileTypeLoading) && <Loader/>}
            <div className="main-container w-full flex flex-col gap-4">
                <h1 className="text-9xl font-semibold" style={{fontSize: "1.5rem"}}>Settings</h1>

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
                        isSelected={profileType === "PRIVATE"}
                        onChange={(e) => handleChangeVisibility(e)}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-medium">Private Profile</p>
                            <p className="text-tiny text-default-400">
                                When your profile is private, only people following you can see your posts.
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
                        <CardBody style={{width: "100%"}} className="w-full flex flex-col gap-2">
                            <PasswordInput label="Current Password" placeholder="Enter your current password"
                                           value={currentPassword} setValue={setCurrentPassword}/>
                            <PasswordInput label="New Password" placeholder="Enter your new password"
                                           value={newPassword} setValue={setNewPassword}/>
                            <PasswordInput label="Confirm Password" placeholder="Confirm your new password"
                                           value={confirmPassword} setValue={setConfirmPassword}/>
                            <Button color="primary" className="w-full" onClick={handleUpdatePassword}>
                                Change Password
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                <Button color="danger" className="w-full">
                    Delete Account
                </Button>
            </div>
        </>
    );
}

export default SettingsPage;