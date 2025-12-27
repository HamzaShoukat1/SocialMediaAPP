import { useEffect } from "react"

import { useAppDispatch, useAppSelector } from "./usehook"
import { checkCurrentUser } from "./AuthThunk"

export default function AuthIniitalizer({ children }: { children: React.ReactNode }) {
  const {isLoading} = useAppSelector(state=> state.auth)


  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(checkCurrentUser())
 
  }, [])
  if (isLoading) {
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
  return <>
    {children}</>
}
