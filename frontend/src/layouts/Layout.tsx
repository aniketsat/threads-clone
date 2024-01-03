import React from "react";
import {NextUIProvider} from '@nextui-org/react'
import Appbar from "../components/Appbar.tsx";


function Layout({children}: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = React.useState(false);

    return (
        <>
            <NextUIProvider>
                <main className={`${darkMode && 'dark'} text-foreground bg-background flex-col`}>
                    <Appbar darkMode={darkMode} setDarkMode={setDarkMode} />
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