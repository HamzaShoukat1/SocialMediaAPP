import { bottombarLinks } from "@/source/constant";
import {  NavLink, useLocation } from "react-router-dom";
function BottomBar() {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <NavLink
            to={link.route}
            key={link.label}
            className={`flex flex-col items-center justify-center  gap-1 p-1 rounded-[20px]  transition-all duration-200 ${
              isActive ? "bg-purple-500 scale-100" : "bg-transparent"
            }`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              className={`w-6 h-5 hover:text-white ${
                isActive && "invert brightness-0"
              } }`}
            />
            <p className="text-[10px] text-white ">{link.label}</p>
          </NavLink>
        );
      })}
    </section>
  );
}

export default BottomBar;

// .bottom-bar {@apply z-50 w-full sticky bottom-0 rounded-t-[20px] px-5 py-4 md:hidden;}

