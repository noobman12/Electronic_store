import { Outlet, useNavigate } from "react-router-dom";
import SidebarDk from "../components/SidebarDk";
import SidebarSm from "../components/SidebarSm";
import HeaderApp from "../components/HeaderApp";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const DefaultLayouts = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth()
  // check login
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login')
    }
  }, [navigate, isAuthenticated])
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarDk />
      <SidebarSm />
      <div className="flex flex-col flex-1 w-full">
        <HeaderApp />
        <Outlet />
      </div>

      
    </div>
  );
};

export default DefaultLayouts;
