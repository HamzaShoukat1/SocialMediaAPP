import { createAsyncThunk } from "@reduxjs/toolkit";
import authservice from "@/lib/appwrite/auth";


export const checkCurrentUser = createAsyncThunk(
    'auth/checkCurrentUser',
    async(_, {rejectWithValue})=> {
        try {
            const account = await authservice.getCurrentUser()
            if(!account) return null


            return {
                 id: account.$id,
        name: account.name,
        username: account.username,
        email: account.email,
        imageUrl: account.imageUrl,
        bio: account.bio,
            }
            
        } catch (error) {
                  return rejectWithValue(error);
        }
    }
)