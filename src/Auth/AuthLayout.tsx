import {Outlet,Navigate} from 'react-router-dom'
import { useAuthContext } from '@/context/Authcontext/AuthContext'
export default function AuthLayout() {
  
  const { isauthenticated } = useAuthContext();

  if (isauthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen"> 
      <section className='flex flex-1 w-1/2 justify-center items-center flex-col py-10'>
        <Outlet />
      </section>

      <img 
        src="/assets/icons/images/side-img.svg"
        alt="logo"
        className=" hidden xl:block h-screen w-1/2 object-cover bg-no-repeat " 
      />
    </div>
  );
}
