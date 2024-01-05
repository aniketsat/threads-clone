import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Dropdown, DropdownTrigger,DropdownMenu, DropdownItem, Avatar} from "@nextui-org/react";
import CreateEditThread from "./CreateEditThread.tsx";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../app/features/userSlice.ts";
import {useLogoutMutation} from "../app/services/authApi.ts";
import Loader from "./Loader.tsx";
import {toast} from "react-toastify";


type PropType = {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Appbar({darkMode, setDarkMode}: PropType) {
    const dispatch = useDispatch();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = useSelector((state) => state.user.user);

    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const [logoutMutation, {isLoading}] = useLogoutMutation();
    const handleLogout = async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        logoutMutation().unwrap()
            .then((res) => {
                console.log(res);
                toast.success(res.message);
                dispatch(logout());
                navigate("/auth");
            })
            .catch((err) => {
                console.log(err);
                // toast.error(err.data.message || "Something went wrong");
            });
    }

    const menuItems = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Search",
            href: "/search",
        },
        {
            label: "Create",
        },
        {
            label: "Notifications",
            href: "/notifications",
        },
        {
            label: "Profile",
            href: `@${user?.username}`
        },
    ];

    return (
        <>
            {isLoading && <Loader />}
            <Navbar onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="nav-side-menu"/>
                    <NavbarBrand>
                        <p className="font-bold text-inherit" style={{
                            fontSize: "1.5rem",
                            lineHeight: "1.75rem",
                            letterSpacing: "-0.025em",
                        }}>Threads</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent justify="center" className="sm:hidden md:flex lg:flex xl:flex nav-main-menu">
                    {
                        menuItems.map((item, index) => {
                            if (item.label !== "Create") {
                                return (
                                    <NavbarItem key={`${index}`}>
                                        <Link color="foreground" as={RouterLink} to={item.href}>
                                            {item.label}
                                        </Link>
                                    </NavbarItem>
                                )
                            } else {
                                return (
                                    <NavbarItem key={`${index}`}>
                                        <CreateEditThread />
                                    </NavbarItem>
                                )
                            }
                        })
                    }
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name={user?.username}
                                size="sm"
                                src={user?.avatar}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2" onClick={() => {
                                navigate(`/@${user?.username}`);
                            }}>
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{user?.email}</p>
                            </DropdownItem>
                            <DropdownItem key="switch_appearance" onClick={() => setDarkMode(!darkMode)}>Switch Appearance</DropdownItem>
                            <DropdownItem key="settings" onClick={() => navigate('/settings')}>My Settings</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => {
                        if (item.label !== "Create") {
                            return (
                                <NavbarMenuItem key={`${index}`}>
                                    <Link color="foreground" as={RouterLink} to={item.href}>
                                        {item.label}
                                    </Link>
                                </NavbarMenuItem>
                            )
                        } else {
                            return (
                                <NavbarMenuItem key={`${index}`}>
                                    <CreateEditThread />
                                </NavbarMenuItem>
                            )
                        }
                    })}
                </NavbarMenu>
            </Navbar>
        </>
    );
}
