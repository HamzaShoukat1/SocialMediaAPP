import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthIniitalizer from "./Store/AuthIniitalizer.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Store } from "./Store/Store.ts";
import ErrorPage from "./Root/Pages/ErrorPage.tsx";
const SigninForm = lazy(() => import("./Auth/SigninForm"));
const SignupForm = lazy(() => import("./Auth/SignupForm"));
const Home = lazy(() => import("./Root/Pages/Home"));
const Explore = lazy(() => import("./Root/Pages/Explore"));
const SavedPost = lazy(() => import("./Root/Pages/SavedPost"));
const AllUsers = lazy(() => import("./Root/Pages/AllUsers"));
const CreatePost = lazy(() => import("./Root/Pages/CreatePost"));
const EditPost = lazy(() => import("./Root/Pages/EditPost"));
const PostDetails = lazy(() => import("./Root/Pages/PostDetails"));
const Profile = lazy(() => import("./Root/Pages/Profile"));
const UpdateProfile = lazy(() => import("./Root/Pages/UpdateProfile"));

const AuthLayout = lazy(() => import("./Auth/AuthLayout"));
const RootLayout = lazy(() => import("./Root/Pages/RootLayout"));


const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
    errorElement={<ErrorPage />}
     path="/" element={<App />}>
      {/* public route  */}
      <Route
        element={
          <AuthLayout />
        }
      >
        <Route path="/sign-in" element={<SigninForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
      </Route>

      {/* private route  */}
      <Route
        element={
          <Suspense>
            <AuthIniitalizer>
            <RootLayout />
            </AuthIniitalizer>
          </Suspense>
        }
      >
        <Route index element={<Home />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/saved" element={<SavedPost />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />

        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/profile/:id/*" element={<Profile />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
      </Route>
    </Route>
  )
);
createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <Provider store={Store}>
        {/* <AuthIniitalizer> */}
          <RouterProvider router={router} />
        {/* </AuthIniitalizer> */}
      </Provider>
    </QueryClientProvider>
);
