import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../app/features/userSlice.ts";
import {useGetCurrentUserQuery} from "../app/services/userApi.ts";

function PrivateRoutes() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isLoggedIn = useSelector((state) => state.user.isLoggedin);

    React.useEffect(() => {
        if (!isLoggedIn) {
            navigate("/auth");
        }
    }, [isLoggedIn, navigate]);
    

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {data, refetch} = useGetCurrentUserQuery();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        if (isLoggedIn && data?.user) {
            dispatch(setUser(data?.user));
            refetch();
        }
    }, [data, dispatch]);


    return (
        <Outlet />
    );
}

export default PrivateRoutes;