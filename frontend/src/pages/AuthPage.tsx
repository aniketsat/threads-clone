import AuthTab from "../components/AuthTab.tsx";

function AuthPage() {
    return (
        <div className={`flex flex-col justify-center items-center align-middle w-full h-full`} style={{
            minHeight: "calc(100vh - 64px)"
        }}>
            <AuthTab />
        </div>
    );
}

export default AuthPage;