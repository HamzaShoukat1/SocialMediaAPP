import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../button";
import { useSIgnoutAccountmutation } from "@/lib/reactquery/queryandmutations";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../alert-dialog';
import { useAppDispatch, useAppSelector } from "@/Store/usehook";
import { logout } from "@/Store/AuthSlice";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { sidebarLinks } from "../../../../source/constant/index";
import type { INavLink } from "@/lib/types/types";
import { useLocation } from "react-router-dom";

function SideBar({ iscollapsed, setiscollapsed }: any) {
  const { user} = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const { mutate: SignOut } = useSIgnoutAccountmutation({
    onSuccess: () => {
      dispatch(logout());
      navigate("/sign-in", { replace: true });
    },
    onError: (error: any) => {
      console.log("Logout failed or session missing, forcing local logout", error);
      dispatch(logout());
      navigate("/sign-in", { replace: true });
    },
  });

  const handleLogout = () => {
  if (!user) {
    dispatch(logout());
    navigate("/sign-in", { replace: true });
    return;
  }
  SignOut();
};


  return (
    <Sidebar
      collapsed={iscollapsed}
      backgroundColor="black"
      rootStyles={{ height: "100vh", position: "fixed", color: "white" }}
    >
      <Menu
        menuItemStyles={{
          button: {
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "black", color: "white" },
          },
        }}
      >
        <MenuItem
          onClick={() => setiscollapsed((prev: any) => !prev)}
          icon={iscollapsed ? <FaArrowRight /> : undefined}
        >
          {!iscollapsed && (
            <div className="flex justify-end items-center ml-3">
              <p className="text-2xl"><FaArrowLeft /></p>
            </div>
          )}
        </MenuItem>

        {!iscollapsed && (
          <div className="flex flex-col justify-center items-center mb-10">
            <Link to={`/profile/${user?.$id}`} className="flex gap-3 items-center">
              <img
                src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                className="w-20 h-20 rounded-full"
              />
            </Link>
            <div className="flex flex-col items-center">
              <p className="body-bold">{user?.name}</p>
              <p className="small-regular">@{user?.username}</p>
            </div>
          </div>
        )}

        {/* Sidebar links */}
        <div className={`${iscollapsed ? undefined : "pl-4"}`}>
          <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link: INavLink) => {
              const isActive = pathname === link.route;
              return (
                <li key={link.label} className="w-38">
                  <NavLink
                    to={link.route}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-2xl transition-colors duration-200 
                      ${isActive ? "bg-purple-500 text-white" : "text-gray-400"}`}
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`w-5 h-5 hover:text-white ${isActive && "invert-white"}`}
                    />
                    {!iscollapsed && <span className="text-white">{link.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout button */}
        <div className="mt-60 cursor-pointer">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <img src="/assets/icons/logout.svg" alt="logout" />
                {!iscollapsed && <p className="text-gray-200 small-medium lg:base-medium">Logout</p>}
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Menu>
    </Sidebar>
  );
}

export default SideBar;
