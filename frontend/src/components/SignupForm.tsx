import {Button, Input, Link} from "@nextui-org/react";
import React from "react";
import {toast} from "react-toastify";
import { useRegisterMutation } from "../app/services/authApi.ts";
import Loader from "./Loader.tsx";

type PropType = {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
};
function SignupForm({setSelected}: PropType) {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [register, { isLoading }] = useRegisterMutation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error("Please fill all the fields");
            return;
        }
        register({ name, email, password })
            .unwrap()
            .then((res) => {
                console.log(res);
                toast.success(res?.message);
                setSelected("login");
            })
            .catch((err) => {
                toast.error(err.data.message || "Something went wrong");
            });
    }

    return (
        <>
            {isLoading && <Loader />}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                    isRequired
                    label="Name"
                    placeholder="Enter your name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    Already have an account?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                        Login
                    </Link>
                </p>
                <div className="flex gap-2 justify-end">
                    <Button fullWidth color="primary" type="submit">
                        Sign up
                    </Button>
                </div>
            </form>
        </>
    );
}

export default SignupForm;