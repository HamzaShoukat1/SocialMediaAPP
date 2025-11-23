import TopBar from "@/components/ui/shared/TopBar";
import SideBar from "@/components/ui/shared/SideBar";
import BottomBar from "@/components/ui/shared/BottomBar";
import { Outlet } from "react-router-dom";
function RootLayout() {
  return (
    <div className=" flex flex-col   min-h-screen  ">
      <TopBar />
      {/* //sidebar + main home page flex  */}
      <div className="flex flex-1">
        <aside className="hidden md:block md:w-64 lg:w-72 border-r border-gray-800 sticky top-0 h-screen">
      <SideBar />
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
