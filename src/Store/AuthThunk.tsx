import { createAsyncThunk } from "@reduxjs/toolkit";
import authservice from "@/lib/appwrite/auth";


export const checkCurrentUser = createAsyncThunk(
    'auth/checkCurrentUser',
    async(_, {rejectWithValue})=> {
        try {

            //check seesion cookie
            const account = await authservice.getAccount()
            if(!account) return null


            const user = await authservice.getUserByAccountId(account.$id)
            // return user

            return {
                 $id: user?.$id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        imageUrl: user?.imageUrl,
        bio: user?.bio,
            }
            
        } catch (error) {
                  return rejectWithValue(error);
        }
    }
)