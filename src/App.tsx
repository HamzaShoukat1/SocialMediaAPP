// import './global.css'
import { Outlet } from "react-router-dom"
import './index.css'
import { Toaster } from "./components/ui/sonner"
import AuthWrapper from "./context/Authcontext/AuthWrapper"

function App() {

  return (
    <>
<div>
  {/* heaader  */}
  <Toaster position="top-right" />
  <main>
    <AuthWrapper>
    <Outlet />
    </AuthWrapper>
  </main>
  {/* footer  */}
</div>
    </>
    

  )
  
  

  
}




export default App





