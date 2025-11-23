import { createContext,useContext, } from "react";
import { type IContextType } from "../../lib/types/types";


export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email:'',
    imageUrl: '',
    bio: '',

}

export const INITIAL_STATE= {
    user: INITIAL_USER,
    setUser:()=>{},
    isLoading: false,
    isauthenticated: false,
    setIsauthenticated: ()=> {},
    checkCurrentUser: async()=> false as boolean
}


const AuthContext = createContext<IContextType>(INITIAL_STATE)

export const AuthProvider = AuthContext.Provider




export const useAuthContext = ()=> useContext(AuthContext)