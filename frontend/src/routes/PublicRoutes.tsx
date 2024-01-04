import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

function PublicRoutes() {
    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isLoggedIn = useSelector((state) => state.user.isLoggedin);

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <Outlet />
    );
}

export default PublicRoutes;