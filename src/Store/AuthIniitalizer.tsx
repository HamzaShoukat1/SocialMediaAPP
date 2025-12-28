import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./usehook";
import { checkCurrentUser } from "./AuthThunk";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth); // only care about user
  const [checking, setChecking] = useState(true);

  // Check current user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkCurrentUser()).unwrap();
      } catch (err) {
        console.warn("User not logged in or session expired", err);
      } finally {
        setChecking(false);
      }
    };
    initAuth();
  }, [dispatch]);

  // Show loader while checking
  if (checking) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-13 h-13">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-black animate-spin"></div>
          </div>
          <p className="text-gray-600 text-sm font-medium tracking-wide">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
}
