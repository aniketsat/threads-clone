import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Dropdown, DropdownTrigger,DropdownMenu, DropdownItem, Avatar} from "@nextui-org/react";
import CreateEditThread from "./CreateEditThread.tsx";
import {useDispatch} from "react-redux";
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
            href: "/profile",
        },
    ];

    return (
        <>
            {isLoading && <Loader />}
            <Navbar onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="nav-side-menu"/>
                    <NavbarBrand>
                        <p className="font-bold text-inherit">Threads</p>
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
                                name="Jason Hughes"
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">zoey@example.com</p>
                            </DropdownItem>
                            <DropdownItem key="switch_appearance" onClick={() => setDarkMode(!darkMode)}>Switch Appearance</DropdownItem>
                            <DropdownItem key="settings">My Settings</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${index}`}>
                            <Link
                                color="foreground"
                                className="w-full"
                                as={RouterLink}
                                to={item.href}
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </>
    );
}
