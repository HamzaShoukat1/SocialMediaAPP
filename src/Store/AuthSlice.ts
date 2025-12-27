import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { checkCurrentUser } from "./AuthThunk";
import type { IReduxType, IUser } from "@/lib/types/types";

import { loadState } from "./localStorage";
const savedUser =  loadState()


const INITIAL_USER = savedUser?.user || {
    id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",

};
const initialState:IReduxType = {
    user:INITIAL_USER,
    isLoading:savedUser ? false : true,
    isAuthenticated:!!savedUser?.user?.id
}




const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
       
        logout: (state)=> {
           state.user = initialState.user

        },
        updateUser: (state,action:PayloadAction<Partial<IUser>>)=> {
            state.user = {
                ...state.user,
                ...action.payload
            }

        }
    },


    extraReducers: (builder)=> {
        builder

       .addCase(checkCurrentUser.pending,(state)=> {
        state.isLoading = true

       })
         .addCase(checkCurrentUser.fulfilled,(state,action)=> {
        state.isLoading = false;
        if(!action.payload){
            state.user = initialState.user;
            state.isAuthenticated = false;
            return
        }else{
                    state.user = action.payload
        state.isAuthenticated = true
        }




       })
        .addCase(checkCurrentUser.rejected,(state)=> {
        state.isLoading = false,
        state.user = initialState.user;
        state.isAuthenticated = false;

       })
       

    }

})
export const {logout,updateUser} = authSlice.actions
export default authSlice.reducer