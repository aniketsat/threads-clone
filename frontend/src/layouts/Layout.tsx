import React from "react";
import {NextUIProvider} from '@nextui-org/react'
import Appbar from "../components/Appbar.tsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useLocation} from "react-router-dom";


function Layout({children}: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = React.useState(false);

    const location = useLocation();

    const [pathname, setPathname] = React.useState(window.location.pathname);
    React.useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);


    return (
        <>
            <NextUIProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme={darkMode ? "dark" : "light"}
                />
                <main className={`${darkMode && 'dark'} text-foreground bg-background flex-col`}>
                    {
                        pathname !== "/auth" && <Appbar darkMode={darkMode} setDarkMode={setDarkMode} />
                    }
                    <div className="flex flex-col w-full h-full"
                         style={{
                            minHeight: "calc(100vh - 64px)"
                         }}>
                        {children}
                    </div>
                </main>
            </NextUIProvider>
        </>
    );
}

export default Layout;