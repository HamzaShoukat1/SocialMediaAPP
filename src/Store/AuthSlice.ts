import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { checkCurrentUser } from "./AuthThunk";
import type {  IUser } from "@/lib/types/types";

import { loadState } from "./localStorage";
const savedUser =  loadState()


// const INITIAL_USER = savedUser?.user || {
//     $id: "" ,
//   name: "",
//   username: "",
//   email: "",
//   imageUrl: "",
//   bio: "",

// };
interface AuthState {
    user:IUser | null,
    status: "idle" | "loading" | "authenticated" | "unauthenticated"
}

const initialState: AuthState =  {
    user:savedUser?.user?.$id ?? null,

    status: 'idle',
}
// savedUser ? false : true,



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
       
        logout: (state)=> {
           state.user = null
           state.status = 'unauthenticated'

        },
        updateUser: (state,action:PayloadAction<Partial<IUser>>)=> {
          if(state.user){
              state.user = {
                ...state.user,
                ...action.payload
            }

          }
        }
    },


    extraReducers: (builder)=> {
        builder

       .addCase(checkCurrentUser.pending,(state)=> {
        state.status = 'loading'

       })
         .addCase(checkCurrentUser.fulfilled,(state,action)=> {
        if(!action.payload){
            state.user = null
            state.status = 'unauthenticated';
            
        }else{
                    state.user = action.payload
        state.status = 'authenticated'
        }




       })
        .addCase(checkCurrentUser.rejected,(state)=> {
        state.user = null
        state.status = 'unauthenticated';

       })
       

    }

})
export const {logout,updateUser} = authSlice.actions
export default authSlice.reducer