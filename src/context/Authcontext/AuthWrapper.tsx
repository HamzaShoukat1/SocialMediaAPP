import type { IUser } from "@/lib/types/types";
import { AuthProvider, INITIAL_USER } from "./AuthContext";
import { useEffect, useState } from "react";
import authservice from "@/lib/appwrite/auth";
import { useNavigate } from "react-router-dom";


export default function AuthWrapper({children}: {children:React.ReactNode}) {
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isLoading, setloading] = useState(true)
    const [isauthenticated, setIsauthenticated] = useState(false)
    const navigate = useNavigate()
    
    const checkCurrentUser = async()=> {

        try {
            const currentUserAccount = await authservice.getCurreentUser()
            
            if(currentUserAccount){
                setUser({
                    id:currentUserAccount.$id,
                    name:currentUserAccount.name,
                    username:currentUserAccount.username,
                    email:currentUserAccount.email,
                    imageUrl:currentUserAccount.imageUrl,
                    bio:currentUserAccount.bio,
                })
                setIsauthenticated(true)
            }
            return false
            
        } catch (error) {
         return false
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
      const initial = async ()=> {
        setloading(true);
        const islogedin =  await checkCurrentUser()
        if(!islogedin){
            navigate("/sign-in")
        }
        setloading(false)
      };
      initial()

     
    }, [])
    

    const value = {
        user,
        setUser,
        isLoading,
        setloading,
isauthenticated,
setIsauthenticated,
    checkCurrentUser
    }
  if (isLoading) {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">

      <div className="flex flex-col items-center space-y-4">
        {/* Loader circle */}
        <div className="relative w-13 h-13">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-black animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Loading, please wait...
        </p>
      </div>

    </div>
  );
}



  return (
    <AuthProvider value={value}>
        {children}
    </AuthProvider>
  

  )
}
