import {Button, Input, Link} from "@nextui-org/react";
import React from "react";

type PropType = {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
};
function SignupForm({setSelected}: PropType) {
    return (
        <form className="flex flex-col gap-4">
            <Input isRequired label="Name" placeholder="Enter your name" type="password"/>
            <Input isRequired label="Email" placeholder="Enter your email" type="email"/>
            <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type="password"
            />
            <p className="text-center text-small">
                Already have an account?{" "}
                <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                </Link>
            </p>
            <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary">
                    Sign up
                </Button>
            </div>
        </form>
    );
}

export default SignupForm;