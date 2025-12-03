import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../button";
import { useSIgnoutAccountmutation } from "@/lib/reactquery/queryandmutations";
import { useEffect } from "react";
import {AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,} from '../alert-dialog'
import {
  INITIAL_USER,
  useAuthContext,
} from "@/context/Authcontext/AuthContext";
import { sidebarLinks } from "../../../source/constant/index";
import type { INavLink } from "@/lib/types/types";
import { useLocation } from "react-router-dom";

function SideBar() {
  const { pathname } = useLocation();
  const { mutate: SignOut, isSuccess } = useSIgnoutAccountmutation();
  const naviagte = useNavigate();
  const { user, setUser, setIsauthenticated } = useAuthContext();
  console.log("x",user);
  
  useEffect(() => {
    if (isSuccess) {
      setUser(INITIAL_USER), 
      setIsauthenticated(false);
      naviagte("/sign-in");
    }
  }, [isSuccess]);

  return (
    <nav className=" fixed ">
      <div className="flex flex-col gap-11">
        <Link to={`/Profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-14 h-14  rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular">@{user.username}</p>
          </div>
        </Link>
        {/* //  */}

        <ul className="flex flex-col gap-6 ">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className="w-38">
                <NavLink
                  to={link.route}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-2xl
             transition-colors duration-200 
          ${
            isActive
              ? "bg-purple-500 text-white"
              : "text-gray-400 hover:bg-purple-500"
          }`}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`w-5 h-5 hover:text-white ${
                      isActive && "invert-white"
                    } }`}
                  />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* //  */}
    <div className="mt-60 cursor-pointer">
  <AlertDialog >
    <AlertDialogTrigger asChild>
      <Button variant="ghost" className="cursor-pointer">
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="text-gray-200 small-medium lg:base-medium">Logout</p>
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent className="bg-black">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          You will be logged out of your account.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>

        <AlertDialogAction  className='cursor-pointer' onClick={() => SignOut()}>
          Yes, Logout
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>

    </nav>
  );
}

export default SideBar;
