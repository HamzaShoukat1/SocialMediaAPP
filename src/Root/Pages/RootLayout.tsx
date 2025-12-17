import TopBar from "@/components/ui/shared/TopBar";
import BottomBar from "@/components/ui/shared/BottomBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/ui/shared/sidebar/SideBar"

function RootLayout() {
  const [isCollapsed, setisCollapsed] = useState(false)
  return (
    <div className="flex flex-col    min-h-screen  ">
      <TopBar />
      {/* //sidebar + main home page flex  */}
      <div className="flex flex-1 ml-3 mt-2 ">
        <aside className={`hidden md:block ${isCollapsed ? "w-0" : "w-50 lg:w-72"}  border-gray-800   h-screen`}>
      <Sidebar
      iscollapsed={isCollapsed}
      setiscollapsed={setisCollapsed}
       />
        </aside>
      <section className=" flex flex-1 p-4 h-full">
        <Outlet />

      </section>
      </div>
      {/* //  */}

      <BottomBar />
    </div>
  );
}

export default RootLayout;
