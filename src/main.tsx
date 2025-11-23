import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SigninForm from "./Auth/SigninForm.tsx";
import SignupForm from "./Auth/SignupForm.tsx";
import Home from "./Root/Pages/Home.tsx";
import AuthLayout from "./Auth/AuthLayout.tsx";
import RootLayout from "./Root/Pages/RootLayout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AllUsers from "./Root/Pages/AllUsers.tsx";
import CreatePost from "./Root/Pages/CreatePost.tsx";
import EditPost from "./Root/Pages/EditPost.tsx";
import PostDetails from "./Root/Pages/PostDetails.tsx";
import Profile from "./Root/Pages/Profile.tsx";
import UpdateProfile from "./Root/Pages/UpdateProfile.tsx";
import SavedPost from "./Root/Pages/SavedPost.tsx";
import Explore from "./Root/Pages/Explore.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* public route  */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SigninForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
      </Route>

      {/* private route  */}
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/saved" element={<SavedPost/>} />
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
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
