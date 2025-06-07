// Layout.tsx
import { Outlet } from "react-router";
import Navbar from "./pages/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar /> 
      <Outlet /> 
    </>
  );
};

export default Layout;
