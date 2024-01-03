import React from "react";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./SignupForm.tsx";

function AuthTab() {
    const [selected, setSelected] = React.useState("login");

    return (
        <Card
            className="auth-tab-container"
        >
            <CardBody>
                <Tabs
                    fullWidth
                    size="lg"
                    aria-label="Tabs form"
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(key as string)}
                >
                    <Tab key="login" title="Login">
                        <LoginForm setSelected={setSelected} />
                    </Tab>
                    <Tab key="sign-up" title="Sign up">
                        <RegisterForm setSelected={setSelected} />
                    </Tab>
                </Tabs>
            </CardBody>
        </Card>
    );
}

export default AuthTab;