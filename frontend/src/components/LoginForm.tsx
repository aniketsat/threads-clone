import {Button, Input, Link} from "@nextui-org/react";
import React from "react";
import {useLoginMutation} from "../app/services/authApi.ts";
import Loader from "./Loader.tsx";
import {toast} from "react-toastify";
import { setRefreshToken, setAccessToken, setLoggedin } from "../app/features/userSlice.ts";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

type PropType = {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
};
function LoginForm({setSelected}: PropType) {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [login, {isLoading}] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill all the fields");
            return;
        }
        login({email, password})
            .unwrap()
            .then((res) => {
                console.log(res);
                dispatch(setRefreshToken(res?.refreshToken));
                dispatch(setAccessToken(res?.accessToken));
                dispatch(setLoggedin(true));
                toast.success(res?.message);
                navigate("/");
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    return (
        <>
            {isLoading && <Loader />}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                    isRequired
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-center text-small">
                    Need to create an account?{" "}
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                        Sign up
                    </Link>
                </p>
                <div className="flex gap-2 justify-end">
                    <Button type="submit" fullWidth color="primary">
                        Login
                    </Button>
                </div>
            </form>
        </>
    );
}

export default LoginForm;