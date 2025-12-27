import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../Store/AuthSlice"
import { loadState,saveState } from './localStorage';
const persistedState = loadState()

export const Store = configureStore({
    reducer: {
        auth:authReducer
    },
    preloadedState:{
        auth:persistedState
    }
});
Store.subscribe(()=> {

    saveState(Store.getState().auth)
})

export type  RootState = ReturnType<typeof Store.getState>

export type AppDispatch = typeof Store.dispatch



