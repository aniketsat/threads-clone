import { CircularProgress } from "@nextui-org/react";

function Loader() {
    return (
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 1000,
        }}>
            <CircularProgress size="lg" aria-label="Loading..."/>
        </div>
    );
}

export default Loader;