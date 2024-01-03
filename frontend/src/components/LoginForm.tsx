import {Button, Input, Link} from "@nextui-org/react";
import React from "react";

type PropType = {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
};
function LoginForm({setSelected}: PropType) {
    return (
        <form className="flex flex-col gap-4">
            <Input isRequired label="Email" placeholder="Enter your email" type="email"/>
            <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type="password"
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
    );
}

export default LoginForm;