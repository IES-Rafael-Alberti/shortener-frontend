import { createBrowserRouter } from "react-router";
import LayoutPublic from "../layouts/LayoutPublic";
import Home from "../pages/Home";
import { lazy, Suspense } from "react";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Portfolio from "../pages/Portfolio";
import LayoutPrivate from "../layouts/LayoutPrivate";
import UserProfile from "../pages/UserProfile";
import LinkPage from "../pages/LinkPage";
import ConfigurarLink from "../pages/ConfigurarLink";

const Login = lazy(() => import("../pages/Login"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LayoutPublic />
            </Suspense>),
        errorElement: (
            <Suspense fallback={<div>Loading error page...</div>}>
              <NotFound />
            </Suspense>
          ),
        children: [
            {
                index: true,
                element: (
                <Suspense fallback={<div>Loading...</div>}>
                    <Home />
                </Suspense>)
            },
            {
                path: "/login",
                element: (
                <Suspense fallback={<div>Loading...</div>}>
                    <Login />
                </Suspense>)
            },
            {   
                path: "/register",
                element: (<Suspense fallback={<div>Loading...</div>}>
                    <Register />
                </Suspense>)
            },
            {   
                path: "/portfolio/:id",
                element: (<Suspense fallback={<div>Loading...</div>}>
                    <Portfolio />
                </Suspense>)
            }
        ]
    },
    {
        path: "/userProfile",
        element: <LayoutPrivate />,
        children: [
            {
                index: true,
                element: <Suspense fallback={<div>Loading...</div>}><UserProfile /></Suspense>
            },
            {
                path: "linkPage/:id",  // Aquí se arregla el path
                element: <Suspense fallback={<div>Loading...</div>}><LinkPage /></Suspense>
            },
            {
                path: "linkConfig/:id",  // Aquí se arregla el path
                element: <Suspense fallback={<div>Loading...</div>}><ConfigurarLink /></Suspense>
            }
        ]
    }
])
