// import './global.css'
import { Outlet } from "react-router-dom"
import './index.css'
import { Toaster } from "./components/ui/sonner"

function App() {

  return (
    <>
<div>
  {/* heaader  */}
  <Toaster position="top-right" />
  <main>
    <Outlet />
  </main>
  {/* footer  */}
</div>
    </>
    

  )
  
  

  
}




export default App





