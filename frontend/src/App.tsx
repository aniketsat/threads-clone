import Layout from "./layouts/Layout.tsx";
import PublicRoutes from "./routes/PublicRoutes.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import HomePage from "./pages/HomePage.tsx";
// import SearchPage from "./pages/SearchPage.tsx";
// import NotificationPage from "./pages/NotificationPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ThreadPage from "./pages/ThreadPage.tsx";


function App() {
  return (
    <BrowserRouter>
        <Layout>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path="/auth" element={<AuthPage />} />
                </Route>
                <Route element={<PrivateRoutes />}>
                    <Route path="/" element={<HomePage />} />
                    {/*<Route path="/search" element={<SearchPage />} />*/}
                    {/*<Route path="/notifications" element={<NotificationPage />} />*/}
                    <Route path="/:username" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/post/:threadId" element={<ThreadPage />} />
                </Route>
            </Routes>
        </Layout>
    </BrowserRouter>
  )
}

export default App
